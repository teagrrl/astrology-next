import useSWR from 'swr'
import Item from '../../models/item';
import Player, { PlayerPosition } from '../../models/player';
import Team from '../../models/team';
import { BlaseballPlayer, BlaseballTeam, ChroniclerEntities, ChroniclerEntity, PlayerItem } from '../../models/types';

export type Roster = {
    lineup: Player[],
    rotation: Player[],
    shadows: Player[],
}

export interface LeagueData {
    players: Player[],
    positions: Record<string, PlayerPosition>,
    rosters: Record<string, Roster>,
    teams: Team[],
    items: Record<string, Item>,
    armory: Record<string, Player[]>,
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
        return [player.id, playerPosition]
    }))

    const armory: Record<string, Player[]> = {}
    for(const id in players) {
        const player = players[id]
        for(const item of player.items) {
            armory[item.id] = (armory[item.id] ?? []).concat(player)
        }
    }

    return {
        armory: armory,
        items: items,
        players: players,
        positions: positions,
        rosters: rosters,
        teams: teams,
    };
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