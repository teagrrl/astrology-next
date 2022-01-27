export interface ChroniclerPlayer {
    id: string;
    name: string;

    buoyancy: number;
    divinity: number;
    martyrdom: number;
    moxie: number;
    musclitude: number;
    patheticism: number;
    thwackability: number;
    tragicness: number;

    coldness: number;
    overpowerment: number;
    ruthlessness: number;
    shakespearianism: number;
    suppression: number;
    unthwackability: number;
    totalFingers: number;

    baseThirst: number;
    continuation: number;
    groundFriction: number;
    indulgence: number;
    laserlikeness: number;

    anticapitalism: number;
    chasiness: number;
    omniscience: number;
    tenaciousness: number;
    watchfulness: number;

    pressurization?: number;
    cinnamon?: number;

    hittingRating: number;
    pitchingRating: number;
    baserunningRating: number;
    defenseRating: number;

    permAttr?: string[];
    seasAttr?: string[];
    weekAttr?: string[];
    gameAttr?: string[];
    itemAttr?: string[];

    deceased: boolean;
    soul: number;
    fate: number;
    peanutAllergy: boolean;

    blood: number;
    coffee: number;
    ritual: string;
    evolution: number;
    leagueTeamId?: string;
    tournamentTeamId?: string;
    items?: ChroniclerItem[];
    state?: PlayerState;
}

export interface PlayerState {
    unscatteredName?: string;
}

export interface ChroniclerTeam {
    id: string;
    location: string;
    fullName: string;
    nickname: string;
    slogan: string;
    emoji: string;
    shorthand: string;
    mainColor: string;
    secondaryColor: string;

    lineup: string[];
    rotation: string[];
    shadows?: string[];

    bench?: string[];
    bullpen?: string[];

    permAttr?: string[];
    seasAttr?: string[];
    weekAttr?: string[];
    gameAttr?: string[];

    stadium: string | null;

    state?: TeamState;
}

export interface TeamState {
    scattered?: { fullName: string; nickname: string; location: string };
}

export interface ChroniclerResponseV1<T> {
    data: T[];
}

export interface ChroniclerEntities<T> {
    nextPage: string | null;
    items: ChroniclerEntity<T>[];
}

export interface ChroniclerEntity<T> {
    data: T;
    entityId: string;
    hash: string;
    validFrom: string;
    validTo: string | null;
}

export interface ChroniclerItem {
    id: string;
    name: string;

    root: ItemPart;
    suffix: ItemPart | null;
    prePrefix: ItemPart | null;
    postPrefix: ItemPart | null;
    prefixes: ItemPart[];

    hittingRating: number;
    pitchingRating: number;
    baserunningRating: number;
    defenseRating: number;

    health: number;
    durability: number;
}

export interface ItemPart {
    name: string;
    adjustments: ItemAdjustment[];
}

export type ItemAdjustment = ItemModAdjustment | ItemStatAdjustment;

export interface ItemModAdjustment {
    type: 0;
    mod: string;
}

export interface ItemStatAdjustment {
    type: 1;
    stat: number;
    value: number;
}

export interface ChroniclerTributes {
    teams: TeamTribute[];
    players: PlayerTribute[];
}

export interface TeamTribute {
    peanuts: number;
    teamId: string;
}

export interface PlayerTribute {
    peanuts: number;
    playerId: string;
}

export interface ChroniclerBallpark {
    id: string;
    teamId: string;
    name: string;
    nickname: string;
    model: number | null;

    mainColor: string;
    secondaryColor: string;
    tertiaryColor: string;

    elongation: number;
    fortification: number;
    forwardness: number;
    grandiosity: number;
    inconvenience: number;
    mysticism: number;
    obtuseness: number;
    ominousness: number;
    viscosity: number;

    mods: string[];
    weather: Record<string, number>;
    renoLog: Record<string, boolean>;

    hype: number;
    filthiness: number;
    luxuriousness: number;

    birds: number;
    state: BallparkState;
}

export interface BallparkState {
    air_balloons?: number;
    flood_balloons?: number;
}