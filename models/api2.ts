import Player from "@models/player2"
import Team from "@models/team2"

const api2Url = "https://api2.sibr.dev/mirror/"
export type ApiType = "games" | "players" | "teams" | "sim"

type CategoryName = "defense" | "running" | "batting" | "pitching" | "vibes"
type AttributeName = "sight" | "thwack" | "ferocity" | "control" | "stuff" | "guile" | "reach" | "magnet" | "reflex" 
    | "hustle" | "stealth" | "dodge" | "thrive" | "survive" | "drama"
type RosterLocation = "LINEUP" | "ROTATION" | "SHADOWS"

export interface BlaseballStandings {
    seasonId: string,
    teamId: string,
    wins: number,
    losses: number,
}

interface BlaseballDivision {
    id: string,
    name: string,
}

export interface BlaseballTeam {
    activeTeam: boolean,
    //attributes: [],
    categoryRatings: BlaseballCategoryRating[],
    deceased: boolean,
    division: BlaseballDivision,
    emoji: string,
    id: string,
    locationName: string,
    modifications: BlaseballModification[],
    name: string,
    nickname: string,
    primaryColor: string,
    roster: BlaseballPlayer[],
    secondaryColor: string,
    shorthand: string,
    slogan: string,
    standings: BlaseballStandings[],
}

interface BlaseballCategoryRating {
    name: CategoryName,
    stars: number,
}

interface BlaseballModification {
    modification: {
        backgroundColor: string,
        color: string,
        description: string,
        icon: string,
        name: string,
        textColor: string,
    },
    teamId: string,
}

export interface BlaseballPlayer {
    attributeRatings: BlaseballAttributeRating[],
    attributes: BlaseballAttribute[],
    categoryRatings: BlaseballCategoryRating[],
    id: string,
    //items: [],
    modifications: BlaseballModification[],
    name: string,
    overallRating: number,
    playerHeatMaps: BlaseballPlayerHeatMap[],
    positions: BlaseballPlayerPosition[],
    rosterSlots: BlaseballRosterSlot[],
    team: BlaseballTeam,
}

interface BlaseballAttributeRating {
    category: CategoryName,
    name: AttributeName,
    stars: number,
}

interface BlaseballAttribute {
    name: string,
    value: number,
}

export interface BlaseballPlayerHeatMap {
    currentValue: number,
}

export interface BlaseballPlayerPosition {
    positionName: string | null,
    x: number,
    y: number,
}

export interface BlaseballRosterSlot {
    active: boolean,
    location: RosterLocation,
    orderIndex: number,
}

export async function leagueFetcher() {
    const [fetchedTeams, fetchedPlayers] = await Promise.all([
        teamsFetcher(),
        playersFetcher(),
    ])

    const players = fetchedPlayers.map((player) => new Player(player))
    const teams = fetchedTeams.map((team) => new Team(team, players))

    return {
        teams,
        players,
    }
}

async function teamsFetcher() {
    return await fetcher<BlaseballTeam[]>("teams")
}

async function playersFetcher() {
    return await fetcher<BlaseballPlayer[]>("players")
}

async function fetcher<T>(type : ApiType) : Promise<T> {
    const response = await fetch(api2Url + type, { mode: "cors" })

    return (await response.json()) as T
}