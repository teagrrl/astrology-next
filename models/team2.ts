import { BlaseballPlayer, BlaseballStandings, BlaseballTeam } from "@models/api2"
import Player from "@models/player2"

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

    public readonly division: string
    public readonly standings: TeamStandings[]

    public readonly lineup: Player[] = []
    public readonly rotation: Player[] = []
    public readonly shadows: Player[] = []
    public readonly averages: Record<string, number> = {}

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

        this.division = data.division.name
        this.standings = data.standings.map((standings) => new TeamStandings(standings))
        
        const lineupIds: Record<number, string> = {}
        const rotationIds: Record<number, string> = {}
        const shadowsIds: Record<number, string> = {}
        for(const player of data.roster) {
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
        }

        this.lineup = Object.values(lineupIds)
            .map((id) => players.find((player) => player.id === id))
            .filter((player): player is Player => player !== undefined)
        this.rotation = Object.values(rotationIds)
            .map((id) => players.find((player) => player.id === id))
            .filter((player): player is Player => player !== undefined)
        this.shadows = Object.values(shadowsIds)
            .map((id) => players.find((player) => player.id === id))
            .filter((player): player is Player => player !== undefined)
        
        for(const player of [...this.lineup, ...this.rotation, ...this.shadows]) {
            for(const [name, value] of Object.entries(player.attributes)) {
                this.averages[name] = this.averages[name] ?? 0
                this.averages[name] += value
            }
        }
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