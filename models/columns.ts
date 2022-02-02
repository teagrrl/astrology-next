export type CategoryAttributes = {
    id: string,
    name: string,
    hasRating?: boolean,
    group?: string,
    columns: ColumnAttributes[],
    isSimple?: boolean,
}

export type ColumnAttributes = {
    direction?: "asc" | "desc",
    id: string,
    name: string,
    shorthand: string,
    group?: string,
    isSimple?: boolean,
}

export const getReverseAttributes = (columns: CategoryAttributes[]) => {
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
        group: "lineup",
        columns: [
            {
                direction: "asc",
                id: "buoyancy",
                name: "Buoyancy",
                shorthand: "float",
            },
            {
                direction: "asc",
                id: "divinity",
                name: "Divinity",
                shorthand: "divin",
            },
            {
                direction: "asc",
                id: "martyrdom",
                name: "Martyrdom",
                shorthand: "martyr",
            },
            {
                direction: "asc",
                id: "moxie",
                name: "Moxie",
                shorthand: "moxie",
            },
            {
                direction: "asc",
                id: "musclitude",
                name: "Musclitude",
                shorthand: "muscl",
            },
            {
                direction: "desc",
                id: "patheticism",
                name: "Patheticism",
                shorthand: "path",
            },
            {
                direction: "asc",
                id: "thwackability",
                name: "Thwackability",
                shorthand: "thwack",
            },
            {
                direction: "desc",
                id: "tragicness",
                name: "Tragicness",
                shorthand: "tragic",
            }
        ],
    },
    {
        id: "pitching",
        name: "Pitching",
        hasRating: true,
        group: "rotation",
        columns: [
            {
                direction: "asc",
                id: "coldness",
                name: "Coldness",
                shorthand: "cold",
            },
            {
                direction: "asc",
                id: "overpowerment",
                name: "Overpowerment",
                shorthand: "op",
            },
            {
                direction: "asc",
                id: "ruthlessness",
                name: "Ruthlessness",
                shorthand: "ruth",
            },
            {
                direction: "asc",
                id: "shakespearianism",
                name: "Shakespearianism",
                shorthand: "shakes",
            },
            {
                direction: "asc",
                id: "suppression",
                name: "Suppression",
                shorthand: "supp",
            },
            {
                direction: "asc",
                id: "unthwackability",
                name: "Unthwackability",
                shorthand: "unthwk",
            }
        ],
    },
    {
        id: "baserunning",
        name: "Baserunning",
        hasRating: true,
        group: "lineup",
        columns: [
            {
                direction: "asc",
                id: "baseThirst",
                name: "Base Thirst",
                shorthand: "thrst",
            },
            {
                direction: "asc",
                id: "continuation",
                name: "Continuation",
                shorthand: "cont",
            },
            {
                direction: "asc",
                id: "groundFriction",
                name: "Ground Friction",
                shorthand: "fric",
            },
            {
                direction: "asc",
                id: "indulgence",
                name: "Indulgence",
                shorthand: "indlg",
            },
            {
                direction: "asc",
                id: "laserlikeness",
                name: "Laserlikeness",
                shorthand: "laser",
            }
        ],
    },
    {
        id: "defense",
        name: "Defense",
        hasRating: true,
        group: "roster",
        columns: [
            {
                direction: "asc",
                id: "anticapitalism",
                name: "Anticapitalism",
                shorthand: "anticap",
            },
            {
                direction: "asc",
                id: "chasiness",
                name: "Chasiness",
                shorthand: "chase",
            },
            {
                direction: "asc",
                id: "omniscience",
                name: "Omniscience",
                shorthand: "omni",
            },
            {
                direction: "asc",
                id: "tenaciousness",
                name: "Tenaciousness",
                shorthand: "tenac",
            },
            {
                direction: "asc",
                id: "watchfulness",
                name: "Watchfulness",
                shorthand: "watch",
            }
        ],
    },
    {
        id: "vibes",
        name: "Vibes",
        hasRating: false,
        group: "roster",
        columns: [
            {
                direction: "desc",
                id: "pressurization",
                name: "Pressurization",
                shorthand: "prssr"
            },
            {
                direction: "asc",
                id: "cinnamon",
                name: "Cinnamon",
                shorthand: "cinnm"
            }
        ],
    }
]

export const sibrmetricCategory: CategoryAttributes = {
    id: "sibrmetrics",
    name: "Performance Ratings",
    columns: [
        {
            id: "wobabr",
            name: "wOBA Batter Rating",
            shorthand: "wOBABR",
        },
        {
            id: "erpr",
            name: "Earned Runs Pitcher Rating",
            shorthand: "ERPR",
        },
        {
            id: "bsrr",
            name: "Base Running Rating",
            shorthand: "BsRR",
        },
        {
            id: "dripdr",
            name: "Defensive Runs implicitly Prevented Defense Rating",
            shorthand: "DRiPDR",
        },
    ],
}

export const playerColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        isSimple: true,
        columns: [
            {
                id: "name",
                name: "Name",
                shorthand: "Name",
                direction: "asc",
            },
            {
                id: "team",
                name: "Team",
                shorthand: "Team",
                direction: "asc",
            },
            {
                id: "position",
                name: "Position",
                shorthand: "Position",
                direction: "desc",
            },
            {
                id: "modifications",
                name: "Modifications",
                shorthand: "Modifications",
                direction: "desc",
            },
            {
                id: "items",
                name: "Items",
                shorthand: "Items",
                direction: "desc",
            },
            {
                id: "combined",
                name: "Combined Stars",
                shorthand: "Combined",
                direction: "desc",
                group: "roster",
            },
        ]
    },
    sibrmetricCategory,
    ...playerStatColumns,
    {
        id: "misc",
        name: "Misc",
        group: "roster",
        columns: [
            {
                id: "soul",
                name: "Soul",
                shorthand: "soul",
                direction: "desc",
                group: "roster",
            },
            {
                id: "fate",
                name: "Fate",
                shorthand: "fate",
                direction: "desc",
                group: "roster",
            },
            {
                id: "totalFingers",
                name: "Total Fingers",
                shorthand: "fingers",
                direction: "desc",
                group: "roster",
            },
            {
                id: "peanutAllergy",
                name: "Peanut Allergy",
                shorthand: "allergy",
                direction: "desc",
                group: "roster",
            },
        ]
    },
]

export const playerHistoryColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        isSimple: true,
        columns: [
            {
                id: "date",
                name: "Date",
                shorthand: "Date",
                direction: "asc",
            },
            {
                id: "name",
                name: "Name",
                shorthand: "Name",
            },
            {
                id: "team",
                name: "Team",
                shorthand: "Team",
            },
            {
                id: "modifications",
                name: "Modifications",
                shorthand: "Modifications",
            },
            {
                id: "items",
                name: "Items",
                shorthand: "Items",
            },
            {
                id: "combined",
                name: "Combined Stars",
                shorthand: "Combined",
            },
        ]
    },
    sibrmetricCategory,
    ...playerStatColumns,
    {
        id: "misc",
        name: "Misc",
        group: "roster",
        columns: [
            {
                id: "ritual",
                name: "Pregame Ritual",
                shorthand: "ritual",
            },
            {
                id: "coffee",
                name: "Coffee Style",
                shorthand: "coffee",
            },
            {
                id: "blood",
                name: "Blood Type",
                shorthand: "blood",
            },
            {
                id: "soul",
                name: "Soul",
                shorthand: "soul",
            },
            {
                id: "fate",
                name: "Fate",
                shorthand: "fate",
            },
            {
                id: "totalFingers",
                name: "Total Fingers",
                shorthand: "fingers",
            },
            {
                id: "peanutAllergy",
                name: "Peanut Allergy",
                shorthand: "allergy",
            },
        ]
    },
]

export const squeezerColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        isSimple: true,
        columns: [
            {
                id: "name",
                name: "Name",
                shorthand: "Name",
                direction: "asc",
            },
            {
                id: "rank",
                name: "Rank",
                shorthand: "Rank",
                direction: "desc",
            },
            {
                id: "modifications",
                name: "Modifications",
                shorthand: "Modifications",
                direction: "desc",
            },
            {
                id: "combined",
                name: "Combined Stars",
                shorthand: "Combined",
                direction: "desc",
                group: "roster",
            },
        ]
    },
    {
        id: "sibrmetrics",
        name: "Performance Ratings",
        columns: [
            {
                id: "wobabr",
                name: "wOBA Batter Rating",
                shorthand: "wOBABR",
                direction: "desc",
                group: "lineup",
            },
            {
                id: "erpr",
                name: "Earned Runs Pitcher Rating",
                shorthand: "ERPR",
                direction: "desc",
                group: "rotation",
            },
            {
                id: "bsrr",
                name: "Base Running Rating",
                shorthand: "BsRR",
                direction: "desc",
                group: "lineup",
            },
            {
                id: "dripdr",
                name: "Defensive Runs implicitly Prevented Defense Rating",
                shorthand: "DRiPDR",
                direction: "desc",
                group: "roster",
            },
        ],
    },
    ...playerStatColumns,
    {
        id: "misc",
        name: "Misc",
        group: "roster",
        columns: [
            {
                id: "soul",
                name: "Soul",
                shorthand: "soul",
                direction: "desc",
                group: "roster",
            },
            {
                id: "fate",
                name: "Fate",
                shorthand: "fate",
                direction: "desc",
                group: "roster",
            },
            {
                id: "totalFingers",
                name: "Total Fingers",
                shorthand: "fingers",
                direction: "desc",
                group: "roster",
            },
            {
                id: "peanutAllergy",
                name: "Peanut Allergy",
                shorthand: "allergy",
                direction: "desc",
                group: "roster",
            },
        ]
    },
]

export const itemColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        isSimple: true,
        columns: [
            {
                id: "name",
                name: "Name",
                shorthand: "Name",
                direction: "asc",
            },
            {
                id: "owners",
                name: "Owners",
                shorthand: "Owners",
                direction: "desc",
            },
            {
                id: "durability",
                name: "Durability",
                shorthand: "Durability",
                direction: "desc",
            },
            {
                id: "modifications",
                name: "Modifications",
                shorthand: "Modifications",
                direction: "desc",
            },
            {
                id: "elements",
                name: "Elements",
                shorthand: "Elements",
                direction: "desc",
            },
        ]
    },
    ...playerStatColumns,
]

export const ballparkColumns: CategoryAttributes[] = [
    {
        id: "general",
        name: "General",
        columns: [
            {
                id: "name",
                name: "Nickname",
                shorthand: "Name",
                direction: "asc",
            },
            {
                id: "team",
                name: "Home Team",
                shorthand: "Home Team",
                direction: "asc",
            },
            {
                id: "modifications",
                name: "Modifications",
                shorthand: "Modifications",
                direction: "desc",
            },
            {
                id: "weather",
                name: "Weather",
                shorthand: "Weather",
                direction: "desc",
            },
            {
                id: "type",
                name: "Type",
                shorthand: "Type",
                direction: "asc",
            },
        ],
    },
    {
        id: "stats",
        name: "Stats",
        columns: [
            {
                id: "grandiosity",
                name: "Grandiosity",
                shorthand: "grand",
                direction: "desc",
            },
            {
                id: "fortification",
                name: "Fortification",
                shorthand: "fort",
                direction: "desc",
            },
            {
                id: "obtuseness",
                name: "Obtuseness",
                shorthand: "obtuse",
                direction: "desc",
            },
            {
                id: "ominousness",
                name: "Ominousness",
                shorthand: "ominous",
                direction: "desc",
            },
            {
                id: "inconvenience",
                name: "Inconvenience",
                shorthand: "inconv",
                direction: "desc",
            },
            {
                id: "viscosity",
                name: "Viscosity",
                shorthand: "visc",
                direction: "desc",
            },
            {
                id: "forwardness",
                name: "Forwardness",
                shorthand: "forward",
                direction: "desc",
            },
            {
                id: "mysticism",
                name: "Mysticism",
                shorthand: "myst",
                direction: "desc",
            },
            {
                id: "elongation",
                name: "Elongation",
                shorthand: "elong",
                direction: "desc",
            },
        ],
    },
    {
        id: "condition",
        name: "Condition",
        columns: [
            {
                id: "filthiness",
                name: "Filthiness",
                shorthand: "filth",
                direction: "desc",
            },
            {
                id: "luxuriousness",
                name: "Luxuriousness",
                shorthand: "luxury",
                direction: "desc",
            },
            {
                id: "hype",
                name: "Hype",
                shorthand: "hype",
                direction: "desc",
            },
        ],
    },
    {
        id: "misc",
        name: "Misc",
        columns: [
            {
                id: "birds",
                name: "Birds",
                shorthand: "birds",
                direction: "desc",
            },
        ],
    }
]