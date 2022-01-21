import useSWR from 'swr'
import Item from '../../models/item';
import Player, { PlayerPosition } from '../../models/player';
import PlayerStats, { attributeIds, categoryIds } from '../../models/playerstats';
import Team from '../../models/team';
import { BlaseballPlayer, BlaseballTeam, ChroniclerEntities, ChroniclerEntity, PlayerItem } from '../../models/types';

type Roster = {
    lineup: Player[],
    rotation: Player[],
    shadows: Player[],
}

export type Averages = {
    lineup: Record<string, number>[],
    rotation: Record<string, number>[],
    shadows: Record<string, number>[],
    roster: Record<string, number>[],
}

export interface LeagueData {
    armory: Record<string, Player[]>,
    averages: Record<string, Averages>,
    items: Record<string, Item>,
    players: Player[],
    positions: Record<string, PlayerPosition>,
    rosters: Record<string, Roster>,
    teams: Team[],
}

export const useChroniclerToFetchLeagueData = (): LeagueData | null => {
    const { data, error } = useSWR("leaguedata", leagueFetcher)
    if(error) {
        console.error(error);
    }
    return data ?? null;
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
        for(const attribute of ["wobabr", "slgbr", "bsrr", "batting", "buoyancy", "divinity", "martyrdom", 
                "moxie", "musclitude", "patheticism", "thwackability", "tragicness", "baserunning", 
                "baseThirst", "continuation", "groundFriction", "indulgence", "laserlikeness"]) {
            averages[id].roster[0][attribute] = averages[id].lineup[0][attribute]
            averages[id].roster[1][attribute] = averages[id].lineup[1][attribute]
        }
        for(const attribute of ["erpr", "pitching", "coldness", "overpowerment", "ruthlessness", 
                "shakespearianism", "suppression", "unthwackability", "musclitude"]) {
            averages[id].roster[0][attribute] = averages[id].rotation[0][attribute]
            averages[id].roster[1][attribute] = averages[id].rotation[1][attribute]
        }
        for(const attribute of ["combined", "defense", "anticapitalism", "chasiness", "omniscience", "tenaciousness", 
                "watchfulness", "suppression", "pressurization", "cinnamon", "soul", "fate", "totalFingers", "peanutAllergy"]) {
            averages[id].roster[0][attribute] = (averages[id].lineup[0][attribute] + averages[id].rotation[0][attribute]) / 2
            averages[id].roster[1][attribute] = (averages[id].lineup[1][attribute] + averages[id].rotation[1][attribute]) / 2
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

async function playersFetcher(): Promise<ChroniclerEntity<BlaseballPlayer>[]> {
    return await pagedFetcher<BlaseballPlayer>("player");
}

async function teamsFetcher(): Promise<ChroniclerEntity<BlaseballTeam>[]> {
    return await pagedFetcher<BlaseballTeam>("team");
}

async function itemsFetcher(): Promise<ChroniclerEntity<PlayerItem>[]> {
    return await pagedFetcher<PlayerItem>("item");
}

async function pagedFetcher<T>(type : string) : Promise<ChroniclerEntity<T>[]> {
    const pages : ChroniclerEntities<T>[] = [];
    
    do {
        let url : string = "https://api.sibr.dev/chronicler/v2/entities?type=" + type
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