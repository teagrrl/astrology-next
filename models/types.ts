export interface BlaseballPlayer {
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
    leagueTeamId?: string;
    tournamentTeamId?: string;
    items?: PlayerItem[];
    state?: PlayerState;
}

export interface PlayerState {
    unscatteredName?: string;
}

export interface BlaseballTeam {
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
    entityId: string;
    validFrom: string;
    validTo: string | null;
    data: T;
}

export interface ChroniclerPlayer {
    id: string;
    data: BlaseballPlayer;
}

export interface ChroniclerTeam {
    id: string;
    data: BlaseballTeam;
}

export interface PlayerItem {
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