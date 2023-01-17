import { BlaseballPlayer, BlaseballPlayerPosition, BlaseballRosterSlot, BlaseballTeam } from "@models/api2"
import { getReverseAttributes, playerColumns } from "@models/columns2"

const reverseAttributes = getReverseAttributes(playerColumns)

export default class Player {
    public readonly id: string
    public readonly name: string
    public readonly team: PlayerTeam
    
    public readonly attributes: Record<string, number> = {}
    public readonly stars: Record<string, number> = {}
    public readonly positions: PlayerPosition[] = []
    public readonly rosterSlots: PlayerRosterSlot[] = []

    //public readonly modifications: Modification[] = []
    //public readonly items: Item[] = []

    constructor(data: BlaseballPlayer) {
        this.id = data.id
        this.name = data.name
        this.team = new PlayerTeam(data.team)
        
        this.stars["overall"] = data.overallRating
        data.categoryRatings.forEach((category) => {
            this.stars[category.name] = category.stars
        })
        data.attributes.forEach((attribute) => {
            this.attributes[attribute.name.toLowerCase()] = attribute.value
        })
        this.attributes["batting"] = (this.attributes["sight"] + this.attributes["thwack"] + this.attributes["ferocity"]) / 3
        this.attributes["pitching"] = (this.attributes["control"] + this.attributes["stuff"] + this.attributes["guile"]) / 3
        this.attributes["defense"] = (this.attributes["reach"] + this.attributes["magnet"] + this.attributes["reflex"]) / 3
        this.attributes["running"] = (this.attributes["hustle"] + this.attributes["stealth"] + this.attributes["dodge"]) / 3
        this.attributes["vibes"] = (this.attributes["thrive"] + this.attributes["survive"] + this.attributes["drama"]) / 3
        this.attributes["overall"] = (this.attributes["batting"] + this.attributes["pitching"] + this.attributes["defense"] + this.attributes["running"] + this.attributes["vibes"]) / 5

        this.positions = data.positions.map((position) => new PlayerPosition(position))
        this.rosterSlots = data.rosterSlots.map((slot) => new PlayerRosterSlot(slot))
    }
}

class PlayerTeam {
    public readonly id: string
    public readonly name: string
    public readonly emoji: string
    public readonly primaryColor: string
    public readonly secondaryColor: string

    constructor(data: BlaseballTeam) {
        this.id = data.id
        this.name = data.name
        this.emoji = data.emoji
        this.primaryColor = data.primaryColor
        this.secondaryColor = data.secondaryColor
    }
}

class PlayerPosition {
    public readonly name: string
    public readonly x: number
    public readonly y: number

    constructor(data: BlaseballPlayerPosition) {
        this.x = data.x
        this.y = data.y
        this.name = data.positionName ?? calculatePositionName(data.x, data.y)
    }
}

class PlayerRosterSlot {
    public readonly active: boolean
    public readonly order: number
    public readonly location: "LINEUP" | "ROTATION" | "SHADOWS"

    constructor(data: BlaseballRosterSlot) {
        this.active = data.active
        this.order = data.orderIndex
        this.location = data.location
    }
}

function calculatePositionName(x: number, y: number) {
    const positionVal = x * 6 + y
    switch(positionVal) {
        case 0:
            return "4th base"
        case 1:
            return "Left Guard"
        case 2:
            return "3rd base"
        case 3:
            return "Liner (Left)"
        case 4:
            return "5th base"
        case 5:
            return "Corner Fielder (Left)"
        case 6:
            return "Right Guard"
        case 7:
            return "Center Infielder"
        case 8:
            return "Short stop"
        case 9:
            return "Mid stop"
        case 10:
            return "Long stop"
        case 11:
            return "Back stop"
        case 12:
            return "1st base"
        case 13:
            return "Flanker"
        case 14:
            return "2nd base"
        case 15:
            return "Left Mid Fielder"
        case 16:
            return "Left Fielder"
        case 17:
            return "Wall Runner (Left)"
        case 18:
            return "Liner (Right)"
        case 19:
            return "Mid Flanker"
        case 20:
            return "Right Mid Fielder"
        case 21:
            return "True Mid Fielder"
        case 22:
            return "Left Ranger"
        case 23:
            return "Outer Fielder (Left)"
        case 24:
            return "0th base"
        case 25:
            return "Long Flanker"
        case 26:
            return "Right Fielder"
        case 27:
            return "Right Ranger"
        case 28:
            return "Center Fielder"
        case 29: 
            return "High Fielder (Left)"
        case 30:
            return "Corner Fielder (Right)"
        case 31:
            return "Back Flanker"
        case 32:
            return "Wall Runner (Right)"
        case 33:
            return "Outer Fielder (Right)"
        case 34:
            return "High Fielder (Right)"
        case 35:
            return "High Fielder (Mid)" 
        default:
            return "Somewhere"
    }
}

function getComparatorValue(player: Player, attribute: string, isItemApplied?: boolean) {
    switch(attribute) {
        case "id":
            return player.id
        case "name":
            return player.name
        case "location":
            return player.rosterSlots.map((slot) => slot.location).sort().join(",")
        case "position":
            return player.positions.map((position) => position.name).sort().join(",")
        case "team":
            return player.team.name
        default:
            return player.attributes[attribute]
    }
}

export const PlayerComparator = (column: string, direction?: "asc" | "desc", isItemApplied?: boolean) => {
    return (player1: Player, player2: Player) => {
        let comparison = 0;
        let attribute1 = getComparatorValue(player1, column, isItemApplied)
        let attribute2 = getComparatorValue(player2, column, isItemApplied)
        if(attribute1 !== attribute2) {
            if (attribute1 > attribute2 || attribute1 === void 0) comparison = 1;
            if (attribute1 < attribute2 || attribute2 === void 0) comparison = -1;
        }
        comparison = attribute1 > attribute2 ? -1 : 1
        if(reverseAttributes.includes(column) && direction !== "desc") {
            comparison *= -1
        } else if(direction === "asc") {
            comparison *= -1
        }
        return comparison
    }
}