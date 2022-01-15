import useSWR from 'swr'
import Player, { PlayerPosition } from './models/player';
import Team from './models/team';
import { BlaseballPlayer, BlaseballTeam, ChroniclerEntities, ChroniclerEntity } from './models/types';

export type Roster = {
    lineup: Player[],
    rotation: Player[],
    shadows: Player[],
}

export interface LeagueData {
    players: Record<string, Player>,
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
    const [fetchedTeams, fetchedPlayers] = await Promise.all([
        teamsFetcher(),
        playersFetcher(),
    ]);

    const teams = fetchedTeams.map((team) => new Team(team))
    const players = Object.fromEntries(fetchedPlayers.map((player) => [player.entityId, new Player(player)]))
    const rosters = Object.fromEntries(teams.map((team) => {
        let idToPlayerMapper = (id: string) => players[id];
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

    return {
        players: players,
        positions: positions,
        rosters: rosters,
        teams: teams,
    };
}

export const useChroniclerToFetchTeams = () => {
    const { data, error } = useSWR("team", teamsFetcher)
    if(error) {
        console.error(error);
    }
    return data?.map((entity) => new Team(entity)) ?? [];
}

async function playersFetcher(): Promise<ChroniclerEntity<BlaseballPlayer>[]> {
    return await pagedFetcher<BlaseballPlayer>("player");
}

async function teamsFetcher(): Promise<ChroniclerEntity<BlaseballTeam>[]> {
    return await pagedFetcher<BlaseballTeam>("team");
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