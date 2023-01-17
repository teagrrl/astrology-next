import useSWR from 'swr'
import Item from '@models/item';
import Player, { PlayerPosition } from '@models/player';
import PlayerStats, { AttributeId, attributeIds, categoryIds } from '@models/playerstats';
import Team from '@models/team';
import { ChroniclerEntities, ChroniclerEntity, ChroniclerItem, ChroniclerPlayer, ChroniclerBallpark, ChroniclerTeam, ChroniclerTributes } from '@models/chronicler';
import Ballpark from '@models/ballpark';

type Roster = {
    lineup: Player[],
    rotation: Player[],
    shadows: Player[],
}

export type EntityHistory<T> = {
    id: string,
    changes: string[],
    data: T,
    date: Date,
}

export type Averages = {
    lineup: Record<string, number>[],
    rotation: Record<string, number>[],
    shadows: Record<string, number>[],
    roster: Record<string, number>[],
}

export interface HistoryData<T> {
    data?: EntityHistory<T>[];
    error?: string;
}

export interface TributeData {
    teamIds: string[];
    playerIds: string[];
    error?: string;
}

export interface BallparkData {
    data: Ballpark[];
    error?: string;
}

export interface LeagueData {
    armory: Record<string, Player[]>;
    averages: Record<string, Averages>;
    items: Record<string, Item>;
    players: Player[];
    positions: Record<string, PlayerPosition>;
    rosters: Record<string, Roster>;
    teams: Team[];
    error?: string;
}

export const useChroniclerToFetchLeagueData = (): LeagueData | null => {
    const { data, error } = useSWR("leaguedata", leagueFetcher)
    if(!data) {
        return null
    }
    data.error = error?.toString()
    return data
}

export const useChroniclerToFetchPlayerHistory = (id?: string): HistoryData<Player> => {
    const { data, error } = useSWR(`history/${id}`, () => playersHistoryFetcher(id))
    const snapshots: EntityHistory<Player>[] = []
    data?.forEach((entity, index) => {
        const player = new Player(entity)
        const snapshot: EntityHistory<Player> = {
            id: entity.entityId + "_" + index,
            changes: [],
            data: player,
            date: new Date(entity.validFrom),
        }
        if(index === 0) {
            snapshot.changes.push("first seen")
        } else {
            const lastSnapshot = snapshots[snapshots.length - 1].data
            for(const attribute of ["name", "buoyancy", "divinity", "martyrdom", "moxie", "musclitude", "patheticism", "thwackability", "tragicness", "coldness", "overpowerment", "ruthlessness", "shakespearianism", "suppression", "unthwackability", "totalFingers", "baseThirst", "continuation", "groundFriction", "indulgence", "laserlikeness", "anticapitalism", "chasiness", "omniscience", "tenaciousness", "watchfulness", "pressurization", "cinnamon", "deceased", "soul", "fate", "peanutAllergy", "blood", "coffee", "ritual"]) {
                if(lastSnapshot.data[attribute as AttributeId] !== player.data[attribute as AttributeId]) {
                    snapshot.changes.push(attribute)
                }
            }
            if(lastSnapshot.data.leagueTeamId !== player.data.leagueTeamId) {
                snapshot.changes.push("team")
            }
            const modificationFilter = (id: string) => !["COFFEE_RALLY", "ELSEWHERE", "HEATING_UP", "INHABITING", "MAGMATIC", "ON_FIRE", "OVERPERFORMING", "UNDERPERFORMING"].includes(id) // these mods change too frequently to be worth tracking
            const lastMods = lastSnapshot.modifications(true).filter(modificationFilter)
            const currentMods = player.modifications(!snapshot.data.data.deceased).filter(modificationFilter) // dead players keep game mods forever
            if(lastMods.join(",") !== currentMods.join(",")) {
                lastSnapshot.modifications().filter((id) => player.modifications().indexOf(id) < 0).forEach((id) => {
                    snapshot.changes.push("-" + id.replace(/\_/g, " ").toLowerCase())
                })
                player.modifications().filter((id) => lastSnapshot.modifications().indexOf(id) < 0).forEach((id) => {
                    snapshot.changes.push("+" + id.replace(/\_/g, " ").toLowerCase())
                })
            }
            if(player.items.reduce((ids, item) => ids + item.id + ",", "") !== lastSnapshot.items.reduce((ids, item) => ids + item.id + ",", "")) {
                snapshot.changes.push("items")
            } else if(player.items.reduce((ids, item) => ids + item.status() + ",", "") !== lastSnapshot.items.reduce((ids, item) => ids + item.status() + ",", "")) {
                snapshot.changes.push("item durability")
            }
            
        }
        if(snapshot.changes.length) {
            snapshot.changes.sort()
            snapshots.push(snapshot)
        }
    })
    
    return {
        data: snapshots,
        error: error?.toString(),
    }
}

export const useChroniclerToFetchBallparks = (): BallparkData => {
    const { data, error } = useSWR("ballparks", ballparksFetcher)
    return {
        data: data ? data.map((ballpark) => new Ballpark(ballpark)) : [],
        error: error?.toString(),
    }
}

export const useChroniclerToFetchTributes = (): TributeData => {
    const { data, error } = useSWR("tributes", tributesFetcher)
    return {
        playerIds: data && data.length ? data[0].data.players.map((player) => player.playerId) : [],
        teamIds: data && data.length ? data[0].data.teams.map((team) => team.teamId) : [],
        error: error?.toString(),
    }
}

export async function leagueFetcher(): Promise<LeagueData> {
    const [fetchedTeams, fetchedPlayers, fetchedItems] = await Promise.all([
        teamsFetcher(),
        playersFetcher(),
        itemsFetcher(),
    ]);

    const teams = fetchedTeams.map((team) => new Team(team))
    const players = fetchedPlayers.map((player) => new Player(player))
    const items = Object.fromEntries(fetchedItems.map((item) => [item.entityId, new Item(item.data)]))
    
    const rosters = Object.fromEntries(teams.map((team) => {
        let idToPlayerMapper = (id: string) => players.find((player) => player.id === id);
        let undefinedPlayerFilter = (player : Player | undefined): player is Player => player !== undefined;
        return [team.id, {
            lineup: team.data.lineup.map(idToPlayerMapper).filter(undefinedPlayerFilter),
            rotation: team.data.rotation.map(idToPlayerMapper).filter(undefinedPlayerFilter),
            shadows: team.data.shadows?.map(idToPlayerMapper).filter(undefinedPlayerFilter) || [],
        }]
    }))
    
    const positions = Object.fromEntries(Object.values(players).map((player) => {
        let playerTeam = teams.find((team) => team.id === player.data.leagueTeamId)
        if(!playerTeam) {
            playerTeam = teams.find((team) => team.id === player.data.tournamentTeamId)
        }
        let playerPosition: PlayerPosition = {
            position: undefined,
            team: playerTeam
        };
        if(playerTeam?.data.lineup.includes(player.id)) {
            playerPosition.position = "lineup"
        }
        if(playerTeam?.data.rotation.includes(player.id)) {
            playerPosition.position = "rotation"
        }
        if(playerTeam?.data.shadows?.includes(player.id)) {
            playerPosition.position = "shadows"
        }
        if(!playerPosition.position && player.modifications().includes("STATIC")) {
            playerPosition.position = "static"
        }
        return [player.id, playerPosition]
    }))

    const armory: Record<string, Player[]> = {}
    for(const id in players) {
        const player = players[id]
        for(const item of player.items) {
            armory[item.id] = (armory[item.id] ?? []).concat(player)
        }
    }

    const averages: Record<string, Averages> = {}
    for(const id in rosters) {
        averages[id] = {
            lineup: getPlayerAverages(rosters[id].lineup),
            rotation: getPlayerAverages(rosters[id].rotation),
            shadows: getPlayerAverages(rosters[id].shadows),
            roster: [{}, {}],
        }
    }
    
    for(const id in averages) {
        let lineupSize = rosters[id].lineup.length
        let rotationSize = rosters[id].rotation.length
        for(const attribute of ["wobabr", "slgbr", "bsrr", "batting", "buoyancy", "divinity", "martyrdom", 
                "moxie", "musclitude", "patheticism", "thwackability", "tragicness", "baserunning", 
                "baseThirst", "continuation", "groundFriction", "indulgence", "laserlikeness"]) {
            averages[id].roster[0][attribute] = averages[id].lineup[0][attribute]
            averages[id].roster[1][attribute] = averages[id].lineup[1][attribute]
        }
        for(const attribute of ["erpr", "pitching", "coldness", "overpowerment", "ruthlessness", 
                "shakespearianism", "suppression", "unthwackability"]) {
            averages[id].roster[0][attribute] = averages[id].rotation[0][attribute]
            averages[id].roster[1][attribute] = averages[id].rotation[1][attribute]
        }
        for(const attribute of ["dripdr", "combined", "defense", "anticapitalism", "chasiness", "omniscience", "tenaciousness", 
                "watchfulness", "pressurization", "cinnamon", "soul", "fate", "totalFingers", "peanutAllergy"]) {
            /*averages[id].roster[0][attribute] = (averages[id].lineup[0][attribute] + averages[id].rotation[0][attribute]) / 2
            averages[id].roster[1][attribute] = (averages[id].lineup[1][attribute] + averages[id].rotation[1][attribute]) / 2*/
			averages[id].roster[0][attribute] = ((averages[id].lineup[0][attribute] * lineupSize) + (averages[id].rotation[0][attribute] * rotationSize)) / (lineupSize + rotationSize)
            averages[id].roster[1][attribute] = ((averages[id].lineup[1][attribute] * lineupSize) + (averages[id].rotation[1][attribute] * rotationSize)) / (lineupSize + rotationSize)
        }
    }

    return {
        armory: armory,
        averages: averages,
        items: items,
        players: players,
        positions: positions,
        rosters: rosters,
        teams: teams,
    };
}

function getPlayerAverages(players: Player[]) {
    const baseAvg: Record<string, number> = {}
    const itemAvg: Record<string, number> = {}
    players.map((player) => {
        const stats = new PlayerStats(player)
        for(const id of attributeIds) {
            baseAvg[id] = (baseAvg[id] ?? 0) + (stats.get(id, false) as number ?? 0)
            itemAvg[id] = (itemAvg[id] ?? 0) + (stats.get(id, true) as number ?? 0)
        }
        for(const id of categoryIds) {
            baseAvg[id] = (baseAvg[id] ?? 0) + (stats.getRating(id, false) ?? 0)
            itemAvg[id] = (itemAvg[id] ?? 0) + (stats.getRating(id, true) ?? 0)
        }
    })
    for(const id in baseAvg) {
        baseAvg[id] = baseAvg[id] / players.length
    }
    for(const id in itemAvg) {
        itemAvg[id] = itemAvg[id] / players.length
    }
    return [baseAvg, itemAvg]
}

async function playersHistoryFetcher(id?: string): Promise<ChroniclerEntity<ChroniclerPlayer>[]> {
    if(!id) {
        return []
    }
    return await pagedFetcher<ChroniclerPlayer>("versions", "player", id)
}

async function playersFetcher(): Promise<ChroniclerEntity<ChroniclerPlayer>[]> {
    return await pagedFetcher<ChroniclerPlayer>("entities", "player")
}

async function teamsFetcher(): Promise<ChroniclerEntity<ChroniclerTeam>[]> {
    return await pagedFetcher<ChroniclerTeam>("entities", "team")
}

async function itemsFetcher(): Promise<ChroniclerEntity<ChroniclerItem>[]> {
    return await pagedFetcher<ChroniclerItem>("entities", "item")
}

async function tributesFetcher(): Promise<ChroniclerEntity<ChroniclerTributes>[]> {
    return await pagedFetcher<ChroniclerTributes>("entities", "tributes")
}

async function ballparksFetcher(): Promise<ChroniclerEntity<ChroniclerBallpark>[]> {
    return await pagedFetcher<ChroniclerBallpark>("entities", "stadium")
}

async function pagedFetcher<T>(api: "entities" | "versions", type: string, id?: string) : Promise<ChroniclerEntity<T>[]> {
    const pages : ChroniclerEntities<T>[] = [];
    
    do {
        let url : string = "https://api.sibr.dev/chronicler/v2/" + api + "?type=" + type + (id ? "&id=" + id : "")
        if(pages[pages.length - 1]?.nextPage) {
            url += "&page=" + pages[pages.length - 1]?.nextPage
        }
        pages.push(await fetcher(url))
    } while(pages[pages.length - 1]?.nextPage)
    
    return pages.flatMap((page) => page.items)
}

async function fetcher<T>(url : string) : Promise<T> {
    const response = await fetch(url, { mode: "cors" })

    return (await response.json()) as T
}