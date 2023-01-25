import { BlaseballPlayer, BlaseballStandings, BlaseballTeam } from "@models/api2"
import Player from "@models/player2"
import { getReverseAttributes, playerStatColumns, teamColumns } from "@models/columns2"
import Modification from "@models/modification2"

const reverseAttributes = getReverseAttributes(teamColumns)
const lineupStats = ["overall", ...playerStatColumns
    .filter((category) => category.group ? ["LINEUP", "ROSTER"].includes(category.group) : false)
    .map((category) => [category.id, ...category.columns.map((column) => column.id)])
    .flat() as string[]]
const rotationStats = ["overall", ...playerStatColumns
    .filter((category) => category.group ? ["ROTATION", "ROSTER"].includes(category.group) : false)
    .map((category) => [category.id, ...category.columns.map((column) => column.id)])
    .flat() as string[]]

export interface TeamSnapshot {
    id: string,
    date: Date,
    changes: string[],
    team: Team,
    lineup: BlaseballPlayer[],
    rotation: BlaseballPlayer[],
    shadows: BlaseballPlayer[],
}

export default class Team {
    public readonly id: string
    public readonly emoji: string
    public readonly name: string
    public readonly location: string
    public readonly nickname: string
    public readonly shorthand: string
    public readonly slogan: string

    public readonly primaryColor: string
    public readonly secondaryColor: string

    public readonly active: boolean
    public readonly deceased: boolean
    public readonly modifications: Modification[] = []
    public readonly activePlayers: number
    public readonly inactivePlayers: number
    public readonly totalPlayers: number

    public readonly division: string | null
    public readonly standings: TeamStandings[]
    public readonly wins: number
    public readonly losses: number

    public readonly lineup: Player[] = []
    public readonly rotation: Player[] = []
    public readonly shadows: Player[] = []
    public readonly averages: Record<string, number> = {}
    public readonly stars: Record<string, number> = {}

    constructor(data: BlaseballTeam, players: Player[]) {
        this.id = data.id
        this.emoji = data.emoji
        this.name = data.name
        this.location = data.locationName
        this.nickname = data.nickname
        this.shorthand = data.shorthand
        this.slogan = data.slogan

        this.primaryColor = data.primaryColor
        this.secondaryColor = data.secondaryColor

        this.active = data.activeTeam
        this.deceased = data.deceased
        this.modifications = data.modifications.map((mod) => new Modification(mod.modification))

        this.division = data.division ? data.division.name : null
        this.standings = data.standings.map((standings) => new TeamStandings(standings))
        this.wins = this.standings.reduce((wins, standings) => wins + standings.wins, 0)
        this.losses = this.standings.reduce((losses, standings) => losses + standings.losses, 0)
        
        const lineupIds: Record<number, string> = {}
        const rotationIds: Record<number, string> = {}
        const shadowsIds: Record<number, string> = {}
        const otherIds: string[] = []
        for(const player of data.roster) {
            if(player.rosterSlots.length) {
                for(const slot of player.rosterSlots) {
                    switch(slot.location) {
                        case "LINEUP":
                            lineupIds[slot.orderIndex] = player.id
                            break
                        case "ROTATION":
                            rotationIds[slot.orderIndex] = player.id
                            break
                        case "SHADOWS":
                            shadowsIds[slot.orderIndex] = player.id
                            break
                    }
                }
            } else {
                otherIds.push(player.id) // any ids here seem to be missing player data
            }
        }

        const usedIds = [...Object.values(lineupIds), ...Object.values(rotationIds), ...Object.values(shadowsIds), otherIds]
        this.lineup = Object.values(lineupIds)
            .map((id) => players.find((player) => player.id === id))
            .filter((player): player is Player => player !== undefined)
        this.rotation = Object.values(rotationIds)
            .map((id) => players.find((player) => player.id === id))
            .filter((player): player is Player => player !== undefined)
        this.shadows = [...Object.values(shadowsIds), otherIds]
            .map((id) => players.find((player) => player.id === id))
            .filter((player): player is Player => player !== undefined)
            .concat(players.filter((player) => !usedIds.includes(player.id) && player.team?.id === data.id))
        
        this.activePlayers = this.lineup.length + this.rotation.length
        this.inactivePlayers = this.shadows.length
        this.totalPlayers = this.activePlayers + this.inactivePlayers
        
        if(this.activePlayers > 0) {
            for(const player of [...this.lineup, ...this.rotation]) {
                for(const [name, value] of Object.entries(player.attributes)) {
                    this.averages[name] = this.averages[name] ?? 0
                    if(lineupStats.includes(name) && player.rosterSlots.filter((slot) => slot.location === "LINEUP").length > 0) {
                        this.averages[name] += value
                    }
                    if(rotationStats.includes(name) && player.rosterSlots.filter((slot) => slot.location === "ROTATION").length > 0) {
                        this.averages[name] += value
                    }
                }
            }
            for(const name of Object.keys(this.averages)) {
                let playerCount = 0
                if(lineupStats.includes(name)) playerCount += this.lineup.length
                if(rotationStats.includes(name)) playerCount += this.rotation.length
                if(playerCount > 0) this.averages[name] /= playerCount
            }
        }

        data.categoryRatings.forEach((category) => {
            this.stars[category.name] = category.stars / 5
        })
        this.stars["vibes"] = this.averages["vibes"] ?? 0
        this.stars["overall"] = this.averages["overall"] ?? 0
    }
}
class TeamStandings {
    public readonly season: string
    public readonly wins: number
    public readonly losses: number

    constructor(data: BlaseballStandings) {
        this.season = data.seasonId
        this.wins = data.wins
        this.losses = data.losses
    }
}

function getComparatorValue(team: Team, attribute: string, isItemApplied?: boolean) {
    switch(attribute) {
        case "id":
            return team.id
        case "name":
            return team.name
        case "shorthand":
            return team.shorthand
        case "division":
            return team.division ?? ""
        case "wins":
            return team.wins
        case "losses":
            return team.losses
        default:
            return team.averages[attribute]
    }
}

export const TeamComparator = (column: string = "id", direction?: "asc" | "desc", isItemApplied?: boolean) => {
    return (team1: Team, team2: Team) => {
        let comparison = 0;
        let attribute1 = getComparatorValue(team1, column, isItemApplied)
        let attribute2 = getComparatorValue(team2, column, isItemApplied)
        if(attribute1 !== attribute2) {
            if (attribute1 > attribute2 || attribute1 === void 0) comparison = 1
            if (attribute1 < attribute2 || attribute2 === void 0) comparison = -1
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