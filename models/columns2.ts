type CategoryId = "general" | "batting" | "pitching" | "defense" | "running" | "vibes"
type GeneralId = "date" | "name" | "team" | "location" | "position" | "modifications" | "items" | "overall" | "shorthand" | "division" | "wins" | "losses"
type AttributeId = "sight" | "thwack" | "ferocity" | "control" | "stuff" | "guile" | "reach" | "magnet" | "reflex"
    | "hustle" | "stealth" | "dodge" | "thrive" | "survive" | "drama"
type PlayerGroup = "LINEUP" | "ROTATION" | "ROSTER"
type ColumnDirection = "asc" | "desc"

export type CategoryAttributes = {
    id: CategoryId,
    name: string,
    hasRating?: boolean,
    group?: PlayerGroup,
    columns: ColumnAttributes[],
    isSimple?: boolean,
}

export type ColumnAttributes = {
    direction?: ColumnDirection,
    id: GeneralId | AttributeId,
    name: string,
    group?: PlayerGroup,
    isSimple?: boolean,
}

export const getReverseAttributes = (columns: CategoryAttributes[]): string[] => {
    return ["id", ...columns.map((category) => 
        category.columns.filter((column) => 
            column.direction === "asc"
        ).map((column) => column.id)
    ).flat()]
}

export const playerStatColumns: CategoryAttributes[] = [
    {
        id: "batting",
        name: "Batting",
        hasRating: true,
        group: "LINEUP",
        columns: [
            {
                direction: "desc",
                id: "sight",
                name: "Sight",
            },
            {
                direction: "desc",
                id: "thwack",
                name: "Thwack",
            },
            {
                direction: "desc",
                id: "ferocity",
                name: "Ferocity",
            },
        ],
    },
    {
        id: "pitching",
        name: "Pitching",
        hasRating: true,
        group: "ROTATION",
        columns: [
            {
                direction: "desc",
                id: "control",
                name: "Control",
            },
            {
                direction: "desc",
                id: "stuff",
                name: "Stuff",
            },
            {
                direction: "desc",
                id: "guile",
                name: "Guile",
            },
        ],
    },
    {
        id: "defense",
        name: "Defense",
        hasRating: true,
        group: "LINEUP",
        columns: [
            {
                direction: "desc",
                id: "reach",
                name: "Reach",
            },
            {
                direction: "desc",
                id: "magnet",
                name: "Magnet",
            },
            {
                direction: "desc",
                id: "reflex",
                name: "Reflex",
            },
        ],
    },
    {
        id: "running",
        name: "Running",
        hasRating: true,
        group: "LINEUP",
        columns: [
            {
                direction: "desc",
                id: "hustle",
                name: "Hustle",
            },
            {
                direction: "desc",
                id: "stealth",
                name: "Stealth",
            },
            {
                direction: "desc",
                id: "dodge",
                name: "Dodge",
            },
        ],
    },
    {
        id: "vibes",
        name: "Vibes",
        hasRating: true,
        group: "ROSTER",
        columns: [
            {
                direction: "desc",
                id: "thrive",
                name: "Thrive",
            },
            {
                direction: "desc",
                id: "survive",
                name: "Survive",
            },
            {
                direction: "desc",
                id: "drama",
                name: "Drama",
            },
        ],
    }
]

export const playerColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        isSimple: true,
        columns: [
            {
                id: "team",
                name: "Team",
                direction: "asc",
            },
            {
                id: "name",
                name: "Name",
                direction: "asc",
            },
            {
                id: "location",
                name: "Location",
                direction: "asc",
            },
            {
                id: "position",
                name: "Position",
                direction: "asc",
            },
            {
                id: "modifications",
                name: "Modifications",
                direction: "desc",
            },
            /*{
                id: "items",
                name: "Items",
                direction: "desc",
            },*/
            {
                id: "overall",
                name: "Overall",
                direction: "desc",
                group: "ROSTER",
            },
        ]
    },
    ...playerStatColumns,
]

export const teamColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        isSimple: true,
        columns: [
            {
                id: "name",
                name: "Name",
                direction: "asc",
            },
            {
                id: "shorthand",
                name: "Shorthand",
                direction: "asc",
            },
            {
                id: "division",
                name: "Division",
                direction: "asc",
            },
            {
                id: "wins",
                name: "Wins",
                direction: "desc",
            },
            {
                id: "losses",
                name: "Losses",
                direction: "desc",
            },
            /*{
                id: "modifications",
                name: "Modifications",
                direction: "desc",
            },*/
            {
                id: "overall",
                name: "Overall",
                direction: "desc",
                group: "ROSTER",
            },
        ]
    },
    ...playerStatColumns,
]