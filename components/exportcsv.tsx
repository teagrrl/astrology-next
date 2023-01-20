import { CSVLink } from "react-csv"
import { playerColumns, teamColumns } from "@models/columns2"
import Player from "@models/player2"
import Team from "@models/team2"
import Emoji from "@components/emoji"

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

export function exportPlayerData(players: Player[], isItemApplied?: boolean) {
    const csvMatrix = [["Player ID"].concat(playerColumns.map((category) => {
        const categoryNames = []
        if(category.hasRating) {
            categoryNames.push(category.name + " Rating")
        }
        category.columns.forEach((column) => {
            switch(column.id) {
                case "team":
                    break
                case "name":
                    categoryNames.push("Name", "Team ID")
                    break
                case "location":
                    categoryNames.push("Location Names", "Location Orders")
                    break
                case "position":
                    categoryNames.push("Position Names", "Position X", "Position Y")
                    break
                case "overall":
                    categoryNames.push("Overall Rating")
                    break
                default:
                    categoryNames.push(column.name)
            }
        })
        return categoryNames
    }).flat())]
    players.forEach((player) => {
        const csvRow: string[] = [player.id]
        playerColumns.forEach((category) => {
            if(category.hasRating) {
                csvRow.push(player.attributes[category.id].toString())
            }
            category.columns.forEach((column) => {
                switch(column.id) {
                    case "team":
                        break
                    case "name":
                        csvRow.push(player.name)
                        csvRow.push(player.team.id)
                        break
                    case "location":
                        csvRow.push(player.rosterSlots.map((slot) => slot.location).join(","))
                        csvRow.push(player.rosterSlots.map((slot) => slot.order).join(","))
                        break
                    case "position":
                        csvRow.push(player.positions.map((position) => position.name).join(","))
                        csvRow.push(player.positions.map((position) => position.x).join(","))
                        csvRow.push(player.positions.map((position) => position.y).join(","))
                        break
                    default:
                        csvRow.push(player.attributes[column.id].toString())
                }
            })
        })
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}

export function exportTeamData(teams: Team[], isItemApplied?: boolean) {
    const csvMatrix = [["Team ID"].concat(teamColumns.map((category) => {
        const categoryNames = []
        if(category.hasRating) {
            categoryNames.push(category.name + " Rating")
        }
        category.columns.forEach((column) => {
            switch(column.id) {
                case "overall":
                    categoryNames.push("Overall Rating")
                    break
                default:
                    categoryNames.push(column.name)
            }
        })
        return categoryNames
    }).flat())]
    teams.forEach((team) => {
        const csvRow: string[] = [team.id]
        teamColumns.forEach((category) => {
            if(category.hasRating) {
                csvRow.push(team.averages[category.id] !== undefined ? team.averages[category.id].toString() : "N/A")
            }
            category.columns.forEach((column) => {
                switch(column.id) {
                    case "name":
                        csvRow.push(team.name)
                        break
                    case "shorthand":
                        csvRow.push(team.shorthand)
                        break
                    case "division":
                        csvRow.push(team.division)
                        break
                    case "wins":
                        csvRow.push(team.wins.toString())
                        break
                    case "losses":
                        csvRow.push(team.losses.toString())
                        break
                    default:
                        csvRow.push(team.averages[column.id] !== undefined ? team.averages[column.id].toString() : "N/A")
                }
            })
        })
        csvMatrix.push(csvRow)
    })
    return csvMatrix
}