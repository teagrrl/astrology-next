import { BlaseballPlayer, BlaseballPlayerPosition, BlaseballRosterSlot, BlaseballTeam } from "@models/api2"
import { getReverseAttributes, playerColumns } from "@models/columns2"
import Modification from "@models/modification2"

const reverseAttributes = getReverseAttributes(playerColumns)

export const fieldPositions = ["4th Base", "Left Guard", "3rd Base", "Left Liner", "5th Base", "Left Cornerfielder", "Right Guard", "Center Infielder", "Shortstop", "Midstop", "Longstop", "Backstop", "1st Base", "Flanker", "2nd Base", "Left Midfielder", "Left Fielder", "Left Wallrunner", "Right Liner", "Midflanker", "Right Midfielder", "Midfielder", "Left Ranger", "Left Outerfielder", "0th Base", "Longflanker", "Right Fielder", "Right Ranger", "Center Fielder", "Left Highfielder", "Right Cornerfielder", "Backflanker", "Right Wallrunner", "Right Outerfielder", "Right Highfielder", "Mid Highfielder"]

export interface PlayerSnapshot {
    id: string,
    date: Date,
    changes: string[],
    player: Player,
}

export default class Player {
    public readonly id: string
    public readonly name: string
    public readonly team: PlayerTeam | null

    public readonly modifications: Modification[] = []
    
    public readonly attributes: Record<string, number> = {}
    public readonly stars: Record<string, number> = {}
    public readonly positions: PlayerPosition[] = []
    public readonly rosterSlots: PlayerRosterSlot[] = []

    //public readonly modifications: Modification[] = []
    //public readonly items: Item[] = []

    constructor(data: BlaseballPlayer) {
        this.id = data.id
        this.name = data.name
        this.team = data.team ? new PlayerTeam(data.team) : null

        this.modifications = data.modifications.map((mod) => new Modification(mod.modification))
        
        this.stars["overall"] = data.overallRating / 5
        data.categoryRatings.forEach((category) => {
            this.stars[category.name] = category.stars / 5
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
    public readonly location: "LINEUP" | "ROTATION" | "SHADOWS"
    public readonly order: number
    public readonly name: string

    constructor(data: BlaseballRosterSlot) {
        this.active = data.active
        this.location = data.location
        this.order = data.orderIndex ?? -1
        this.name = getRosterSlotName(this.active, this.location, this.order)
    }
}

function calculatePositionName(x: number, y: number) {
    const positionVal = x * 6 + y
    return positionVal < fieldPositions.length ? fieldPositions[positionVal] : "Somewhere"
}

function getRosterSlotName(active: boolean, location: "LINEUP" | "ROTATION" | "SHADOWS", order: number) {
    let name: string = location
    if(!active) name = "INACTIVE " + name
    switch(location) {
        case "LINEUP":
            name += " ("
            if(order === 0) {
                name += "LEADOFF"
            } else if (order > 0) {
                name += (order + 1) + "-HOLE"
            } else {
                name += "UNKNOWN"
            }
            name += ")"
            break
        case "ROTATION":
            name += " (" + (order + 1) + ")"
    }
    return name
}

function getComparatorValue(player: Player, attribute: string, isItemApplied?: boolean) {
    switch(attribute) {
        case "id":
            return player.id
        case "team":
            return player.team?.name ?? " Black Hole"
        case "name":
            return player.name
        case "location":
            return player.rosterSlots.map((slot) => slot.location + (slot.order.toString().length < 2 ? "0" : "") + slot.order).sort().join(",")
        case "position":
            return player.positions.map((position) => position.name).sort().join(",")
        case "modifications":
            return player.modifications.length
        case "items":
            return player.id
        default:
            return player.attributes[attribute]
    }
}

export const PlayerComparator = (column: string = "id", direction?: "asc" | "desc", isItemApplied?: boolean) => {
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