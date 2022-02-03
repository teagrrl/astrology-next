import { CSVLink } from "react-csv"
import Ballpark from "../models/ballpark"
import { ballparkColumns, itemColumns, playerColumns, playerHistoryColumns, squeezerColumns } from "../models/columns"
import Item from "../models/item"
import Player, { PlayerPosition } from "../models/player"
import PlayerStats from "../models/playerstats"
import Team from "../models/team"
import { Averages, EntityHistory } from "../pages/api/chronicler"
import Emoji from "./emoji"

export type ExportCSVProps = {
    data: string[][],
    filename: string,
}

export default function ExportCSV({ data, filename }: ExportCSVProps) {
    return (
        <CSVLink 
            title="Export as CSV"
            className="flex items-center px-3 py-1 rounded whitespace-nowrap bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
            data={data} 
            filename={`${filename}.csv`}
        >
            <Emoji emoji="0x1F4BE" className="sm:hidden lg:inline lg:mr-1" emojiClass="w-4 h-4 align-[-0.1em]" />
            <span className="hidden sm:inline">Export as CSV</span>
        </CSVLink>
    )
}

export function exportPlayerData(players: Player[], positions: Record<string, PlayerPosition>, isShowSimplified?: boolean, isItemApplied?: boolean) {
    const csvMatrix = [["id"].concat(playerColumns.map((category) => {
        const categoryNames = []
        if(category.hasRating) {
            categoryNames.push(category.name + " Stars")
        }
        if(!isShowSimplified) {
            categoryNames.push(...category.columns.map((column) => column.name))
        }
        return categoryNames
    }).flat())]
    players.forEach((player) => {
        const stats = new PlayerStats(player)
        const csvRow: string[] = [player.id]
        playerColumns.forEach((category) => {
            const ratingValue = stats.get(category.id, isItemApplied) as number
            if(category.hasRating) {
                csvRow.push(ratingValue.toString())
            }
            if(!isShowSimplified) {
                category.columns.forEach((column) => {
                    switch(column.id) {
                        case "name":
                            csvRow.push(player.canonicalName())
                            break
                        case "team":
                            csvRow.push(player.data.leagueTeamId ?? "")
                            break
                        case "position":
                            csvRow.push(positions[player.id].position ?? "")
                            break
                        case "modifications":
                            csvRow.push(player.modifications().join(","))
                            break
                        case "items":
                            csvRow.push(player.items.map((item) => item.name).join(","))
                            break
                        default:
                            const statValue = stats.get(column.id, isItemApplied)
                            if(typeof statValue === "string" || typeof statValue === "number" || typeof statValue === "boolean") {
                                csvRow.push(statValue.toString())
                            } else {
                                csvRow.push("")
                            }
                    }
                })
            }
        })
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}

export function exportPlayerHistoryData(history: EntityHistory<Player>[], isShowSimplified?: boolean, isItemApplied?: boolean) {
    const csvMatrix = [playerHistoryColumns.map((category) => category.columns.map((column) => column.name)).flat()]
    history.forEach((snapshot) => {
        const stats = new PlayerStats(snapshot.data)
        const csvRow: string[] = []
        playerHistoryColumns.forEach((category) => {
            const ratingValue = stats.get(category.id, isItemApplied) as number
            if(category.hasRating) {
                csvRow.push(ratingValue.toString())
            }
            if(!isShowSimplified) {
                category.columns.forEach((column) => {
                    switch(column.id) {
                        case "date":
                            csvRow.push(snapshot.date.toDateString() + " " + snapshot.date.toTimeString())
                            break
                        case "name":
                            csvRow.push(snapshot.data.data.name)
                            break
                        case "team":
                            csvRow.push(snapshot.data.data.leagueTeamId ?? "")
                            break
                        case "modifications":
                            csvRow.push(snapshot.data.modifications().join(","))
                            break
                        case "items":
                            csvRow.push(snapshot.data.items.map((item) => item.name).join(","))
                            break
                        default:
                            const statValue = stats.get(column.id, isItemApplied)
                            if(typeof statValue === "string" || typeof statValue === "number" || typeof statValue === "boolean") {
                                csvRow.push(statValue.toString())
                            } else {
                                csvRow.push("")
                            }
                    }
                })
            }
        })
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}

export function exportSqueezerData(teams: Team[], averages: Record<string, Averages>, ranks: Record<string, number>, isShowSimplified?: boolean, isItemApplied?: boolean) {
    const csvMatrix = [["id"].concat(squeezerColumns.map((category) => {
        const categoryNames = []
        if(category.hasRating) {
            categoryNames.push(category.name + " Stars")
        }
        if(!isShowSimplified) {
            categoryNames.push(...category.columns.map((column) => column.name))
        }
        return categoryNames
    }).flat())]
    teams.forEach((team) => {
        const stats = averages[team.id].roster[isItemApplied? 1 : 0]
        const csvRow: string[] = [team.id]
        playerColumns.forEach((category) => {
            if(category.hasRating) {
                csvRow.push(stats[category.id].toString())
            }
            if(!isShowSimplified) {
                category.columns.forEach((column) => {
                    switch(column.id) {
                        case "name":
                            csvRow.push(team.canonicalName())
                            break
                        case "rank":
                            csvRow.push(ranks ? (ranks[team.id] + 1).toString() : "N/A")
                            break
                        case "modifications":
                            csvRow.push(team.modifications().join(","))
                            break
                        default:
                            const statValue = stats[column.id]
                            if(typeof statValue === "string" || typeof statValue === "number" || typeof statValue === "boolean") {
                                csvRow.push(statValue.toString())
                            } else {
                                csvRow.push("")
                            }
                    }
                })
            }
        })
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}

export function exportItemData(items: Item[], armory: Record<string, Player[]>) {
    const csvMatrix = [["id"].concat(itemColumns.map((category) => category.columns.map((column) => column.name)).flat())]
    items.forEach((item) => {
        const csvRow: string[] = [item.id]
        itemColumns.forEach((category) => 
            category.columns.forEach((column) => {
                switch(column.id) {
                    case "name":
                        csvRow.push(item.name)
                        break
                    case "owners":
                        const owners = armory[item.id]
                        csvRow.push(owners && owners.length > 0 ? owners.map((player) => player.canonicalName()).join(",") : "")
                        break
                    case "durability":
                        csvRow.push(item.durability < 0 ? "Unbreakable" : (item.health + "/" + item.durability))
                        break
                    case "modifications":
                        csvRow.push(item.modifications().join(","))
                        break
                    case "elements":
                        csvRow.push(item.elements.join(","))
                        break
                    default:
                        csvRow.push((item.adjustments[column.id] ?? 0).toString())
                }
            })
        )
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}

export function exportBallparkData(ballparks: Ballpark[]) {
    const csvMatrix = [["id"].concat(ballparkColumns.map((category) => category.columns.map((column) => column.name)).flat())]
    ballparks.forEach((ballpark) => {
        const csvRow: string[] = [ballpark.id]
        ballparkColumns.forEach((category) => 
            category.columns.forEach((column) => {
                switch(column.id) {
                    case "name":
                        csvRow.push(ballpark.data.nickname)
                        break
                    case "team":
                        csvRow.push(ballpark.data.teamId ?? "")
                        break
                    case "modifications":
                        csvRow.push(ballpark.data.mods.join(","))
                        break
                    case "weather":
                        csvRow.push(ballpark.weather().map((weather) => weather.data.name + (weather.frequency ? (" +" + weather.frequency) : "")).join(","))
                        break
                    case "type":
                        csvRow.push(ballpark.prefab()?.name ?? "")
                        break
                    case "birds":
                        csvRow.push(ballpark.data.birds.toString())
                        break
                    case "filthiness":
                        csvRow.push(ballpark.data.filthiness.toString())
                        break
                    case "luxuriousness":
                        csvRow.push(ballpark.data.luxuriousness.toString())
                        break
                    case "hype":
                        csvRow.push(ballpark.data.hype.toString())
                        break
                    default:
                        csvRow.push((ballpark.getStat(column.id) ?? 0).toString())
                        break
                }
            })
        )
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}