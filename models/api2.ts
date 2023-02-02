import Player from "@models/player2"
import Team from "@models/team2"
import Election from "./election"

const chronicler2Url = "https://api2.sibr.dev/chronicler/v0/"
type ChroniclerEndpoint = "entities" | "versions"
export type ChroniclerKind = "player" | "team" | "season_elections" | "team_blessing_preferences"

type CategoryName = "defense" | "running" | "batting" | "pitching" | "vibes"
type AttributeName = "sight" | "thwack" | "ferocity" | "control" | "stuff" | "guile" | "reach" | "magnet" | "reflex" 
    | "hustle" | "stealth" | "dodge" | "thrive" | "survive" | "drama"
type RosterLocation = "LINEUP" | "ROTATION" | "SHADOWS"

export const TeamGroups = [
    {
        id: "ilb",
        name: "ILB",
        teams: [
            "adc5b394-8f76-416d-9ce9-813706877b84",
            "8d87c468-699a-47a8-b40d-cfb73a5660ad",
            "b63be8c2-576a-4d6e-8daf-814f8bcea96f",
            "ca3f1c8c-c025-4d8e-8eef-5be6accbeb16",
            "3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e",
            "979aee4a-6d80-4863-bf1c-ee1a78e06024",
            "105bc3ff-1320-4e37-8ef0-8d595cb95dd0",
            "d9f89a8a-c563-493e-9d64-78e4f9a55d4a",
            "a37f9158-7f82-46bc-908c-c9e2dda7c33b",
            "c73b705c-40ad-4633-a6ed-d357ee2e2bcf",
            "b72f3061-f573-40d7-832a-5ad475bd7909",
            "7966eb04-efcc-499b-8f03-d13916330531",
            "46358869-dce9-4a01-bfba-ac24fc56f57e",
            "36569151-a2fb-43c1-9df7-2df512424c82",
            "eb67ae5e-c4bf-46ca-bbbc-425cd34182ff",
            "23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7",
            "bfd38797-8404-4b38-8b82-341da28b1f83",
            "9debc64f-74b7-4ae1-a4d6-fce0144b6ea5",
            "b024e975-1c4a-4575-8936-a3754a08806a",
            "f02aeae2-5e6a-4098-9842-02d2273f25c7",
            "878c1bf6-0d21-4659-bfee-916c8314d69c",
            "747b8e4a-7e50-4638-a973-ea7950a3e739",
            "57ec08cc-0411-4643-b304-0e80dbc15ac7",
            "bb4a9de5-c924-4923-a0cb-9d1445f1ee5d",
        ],
    },
    {
        id: "historical",
        name: "Historical",
        teams: [
            "88151292-6c12-4fb8-b2d6-3e64821293b3",
            "d6a352fc-b675-40a0-864d-f4fd50aaeea0",
            "54d0d0f2-16e0-42a0-9fff-79cfa7c4a157",
            "71c621eb-85dc-4bd7-a690-0c68c0e6fb90",
            "9494152b-99f6-4adb-9573-f9e084bc813f",
            "a4b23784-0132-4813-b300-f7449cb06493",
            "c19bb50b-9a22-4dd2-8200-bce639b1b239",
            "939db13f-79c9-41c5-9a15-b340b1bea875",
            "3a094991-4cbc-4786-b74c-688876d243f4",
            "55c9fee3-79c8-4467-8dfb-ff1e340aae8c",
            "b6b5df8f-5602-4883-b47d-07e77ed9d5af",
            "00245773-6f25-43b1-a863-42b4068888f0",
            "d0762a7e-004b-48a9-a832-a993982b305b",
            "1e04e5cc-80a6-41c0-af0d-7292817eed79",
            "3543229a-668c-4ac9-b64a-588422481f12",
            "74966fbd-5d77-48b1-8075-9bf197583775",
            "1a51664e-efec-45fa-b0ba-06d04c344628",
            "53d473fb-ffee-4fd3-aa1c-671228adc592",
            "774762ee-c234-4c57-90a1-e1e69db3f6a7",
            "cbd44c06-231a-4d1a-bb7d-4170b06e566a",
            "258f6389-aac1-43d2-b30a-4b4dde90d5eb",
            "4cd14d96-f817-41a3-af6c-2d3ed0dd20b7",
            "67c0a873-ef6d-4a85-8293-af638edf3c9f",
            "ed60c164-fd31-42ff-8ae1-70220626f5a7",
            "26f947db-4e2a-41a5-896c-02cf8eb47af0",
            "7bc12507-1a84-4921-9338-c1888d56dcd7",
            "8e50d878-3dcd-4c27-9f1c-8d8f20f17077",
            "cfd20759-5f9c-4596-9493-2669b6daf396",
            "4c192065-65d8-4010-8145-395f82d24ddf",
            "b47df036-3aa4-4b98-8e9e-fe1d3ff1894b",
            "2e22beba-8e36-42ba-a8bf-975683c52b5f",
        ],
    },
]

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
    division: BlaseballDivision | null,
    emoji: string,
    id: string,
    locationName: string,
    modifications: { modification: BlaseballModification, teamId: string, }[],
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

export interface BlaseballModification {
    backgroundColor: string | null,
    color: string | null,
    description: string | null,
    icon: string | null,
    name: string,
    textColor: string | null,
}

export interface BlaseballPlayer {
    attributeRatings: BlaseballAttributeRating[],
    attributes: BlaseballAttribute[],
    categoryRatings: BlaseballCategoryRating[],
    id: string,
    //items: [],
    modifications: { modification: BlaseballModification, playerId: string, }[],
    name: string,
    overallRating: number,
    playerHeatMaps: BlaseballPlayerHeatMap[],
    positions: BlaseballPlayerPosition[],
    rosterSlots: BlaseballRosterSlot[],
    team?: BlaseballTeam,
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
    orderIndex: number | null,
}

export interface BlaseballElection {
    decrees: BlaseballElectionGroup[],
    blessings: BlaseballElectionGroup[],
}

export interface BlaseballElectionGroup {
    choiceType: string,
    description: string,
    electionComplete: boolean,
    electionOptions: BlaseballElectionOption[],
    endTimestamp: number,
    id: string,
    maximumAllowed: number,
    name: string,
    seasonId: string,
    startTimestamp: number,
}

export interface BlaseballElectionOption {
    description: string,
    electionGroupId: string,
    icon: string,
    id: string,
    name: string,
    results: BlaseballElectionResult[],
    subheading: string,
    tags: string[],
}

export interface BlaseballElectionResult {
    outcomeStrings: string[],
    overallVoteCount: number,
    resultType: string,
    topVoteCount: number,
    topVotedTeam: BlaseballTeam,
    winningTeam: BlaseballTeam,
    winningVoteCount: number,
}

export interface BlaseballElectionPreferences {
    groups: BlaseballElectionPreferenceGroup[],
    team_id: string,
}

interface BlaseballElectionPreferenceGroup {
    id: string,
    top_option_ids: string[],
}

export async function leagueFetcher() {
    const [fetchedTeams, fetchedPlayers] = await Promise.all([
        await pagedFetcher<ChroniclerWrapper<BlaseballTeam>>("entities", "team"),
        await pagedFetcher<ChroniclerWrapper<BlaseballPlayer>>("entities", "player"),
    ])

    const players = fetchedPlayers.map((player) => new Player(player.data))
    const teams = fetchedTeams.map((team) => new Team(team.data, players))

    return {
        teams,
        players,
    }
}

export async function electionFetcher() {
    const [fetchedElections, fetchedPreferences] = await Promise.all([
        await pagedFetcher<ChroniclerWrapper<BlaseballElection>>("entities", "season_elections"),
        await pagedFetcher<ChroniclerWrapper<BlaseballElectionPreferences>>("entities", "team_blessing_preferences"),
    ])

    const elections: Election[] = []
    const mentioned: Record<string, string[]> = {}
    fetchedElections.forEach((wrapper, index) => {
        const newElection = new Election(wrapper.entity_id, index + 1, wrapper.data)
        newElection.blessings.forEach((blessing) => { 
            blessing.options.forEach((option) => {
                mentioned[option.id] = option.results.map((result) => [result.winner.team.id, result.topVoted.team.id]).flat()
            })
        })
        elections.push(newElection)
    })
    const preferences: Record<string, string[]> = {}
    fetchedPreferences.forEach((pref) => {
        pref.data.groups.forEach((group) => {
            group.top_option_ids.forEach((id) => {
                preferences[id] = preferences[id] ?? []
                preferences[id].push(pref.data.team_id)
            })
        })
    })

    return {
        elections, preferences, mentioned,
    }
}

export interface Historical<T> {
    id: string,
    data: T,
    roster?: BlaseballPlayer[],
    date: string,
}

export async function teamHistoryFetcher(id?: string): Promise<Historical<Team>[]> {
    if(!id) {
        return []
    }
    const data = await pagedFetcher<ChroniclerWrapper<BlaseballTeam>>("versions", "team", id)
    return data.map((wrapper, index) => {
        return {
            id: `${wrapper.entity_id}_${index}`,
            data: new Team(wrapper.data, []),
            roster: wrapper.data.roster,
            date: wrapper.valid_from,
        }
    })
}

export async function playerHistoryFetcher(id?: string): Promise<Historical<Player>[]> {
    if(!id) {
        return []
    }
    const data = await pagedFetcher<ChroniclerWrapper<BlaseballPlayer>>("versions", "player", id)
    return data.map((wrapper, index) => {
        return {
            id: `${wrapper.entity_id}_${index}`,
            data: new Player(wrapper.data),
            date: wrapper.valid_from,
        }
    })
}

interface ChroniclerPage<T> {
    next_page: string | null,
    items: T[],
}

interface ChroniclerWrapper<T> {
    kind: ChroniclerKind,
    entity_id: string,
    valid_from: string,
    valid_to: string | null,
    data: T,
}

async function pagedFetcher<T>(endpoint: ChroniclerEndpoint, type: ChroniclerKind, id?: string) : Promise<T[]> {
    const pages : ChroniclerPage<T>[] = []
    
    do {
        let url : string = chronicler2Url + endpoint + "?kind=" + type +(id ? "&id=" + id : "")
        if(pages[pages.length - 1]?.next_page) {
            url += "&page=" + pages[pages.length - 1]?.next_page
        }
        pages.push(await fetcher(url))
    } while(pages[pages.length - 1]?.next_page)
    
    return pages.map((page) => page.items).flat()
}

async function fetcher<T>(url : string) : Promise<T> {
    const response = await fetch(url, { mode: "cors" })

    return (await response.json()) as T
}