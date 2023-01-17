type CategoryId = "general" | "batting" | "pitching" | "defense" | "running" | "vibes"
type GeneralId = "name" | "team" | "location" | "position" | "modifications" | "items" | "overall"
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
    return columns.map((category) => 
        category.columns.filter((column) => 
            column.direction === "asc"
        ).map((column) => column.id)
    ).flat()
}

export const playerStatColumns: CategoryAttributes[] = [
    {
        id: "batting",
        name: "Batting",
        hasRating: true,
        group: "LINEUP",
        columns: [
            {
                direction: "asc",
                id: "sight",
                name: "Sight",
            },
            {
                direction: "asc",
                id: "thwack",
                name: "Thwack",
            },
            {
                direction: "asc",
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
                direction: "asc",
                id: "control",
                name: "Control",
            },
            {
                direction: "asc",
                id: "stuff",
                name: "Stuff",
            },
            {
                direction: "asc",
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
                direction: "asc",
                id: "reach",
                name: "Reach",
            },
            {
                direction: "asc",
                id: "magnet",
                name: "Magnet",
            },
            {
                direction: "asc",
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
                direction: "asc",
                id: "hustle",
                name: "Hustle",
            },
            {
                direction: "asc",
                id: "stealth",
                name: "Stealth",
            },
            {
                direction: "asc",
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
                direction: "asc",
                id: "thrive",
                name: "Thrive",
            },
            {
                direction: "asc",
                id: "survive",
                name: "Survive",
            },
            {
                direction: "asc",
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
            /*{
                id: "modifications",
                name: "Modifications",
                direction: "desc",
            },
            {
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