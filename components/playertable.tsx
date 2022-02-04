import Player, { PlayerPosition } from "../models/player"
import { CategoryAttributes, ColumnAttributes, playerColumns } from "../models/columns"
import Emoji from "./emoji"
import Link from "next/link"
import { Fragment } from "react"
import PlayerStat from "./playerstat"
import ModificationList from "./modificationlist"
import AstrologyLoader from "./loader"
import AverageStat from "./averagestat"
import PlayerTableItems from "./playertableitems"
import StatTableHeader, { StatTableHeaderProps } from "./stattableheader"
import ExportCSV, { ExportCSVProps } from "./exportcsv"

type PlayerTableProps = PlayerTableBodyProps & StatTableHeaderProps & {
    exportData?: ExportCSVProps,
}

type PlayerTableBodyProps = {
    header?: string,
    players: Player[],
    positions: Record<string, PlayerPosition>,
    averages?: Record<string, number>[],
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerTableCellProps = {
    player: Player,
    positions?: Record<string, PlayerPosition>,
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerPositionProps = {
    id: string,
    positions: Record<string, PlayerPosition> | undefined,
}

type AverageTableCellProps = {
    header?: string,
    averages: Record<string, number>[],
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

export default function PlayerTable({ header, players, positions, averages, sort, direction, triggerSort, isShowSimplified, isItemApplied, exportData }: PlayerTableProps) {
    if(!players) {
        return <AstrologyLoader />
    }
    if(!players.length) {
        return <></>
    }
    return (
        <>
            {(header || exportData) && <div className="flex flex-row justify-end p-2">
                {!!header && <h1 className="flex grow justify-center text-2xl font-bold">{header}</h1>}
                {exportData && <ExportCSV {...exportData} />}
            </div>}
            <div className="overflow-auto">
                <table className="table-auto">
                    <StatTableHeader sort={sort} direction={direction} triggerSort={triggerSort} isShowSimplified={isShowSimplified} />
                    <PlayerTableBody header={header} players={players} positions={positions} averages={averages} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
                </table>
            </div>
        </>
    )
}

function PlayerTableBody({ header, players, positions, averages, isShowSimplified, isItemApplied }: PlayerTableBodyProps) {
    return (
        <tbody>
            {players.map((player) => 
                <tr key={player.id} className="duration-300 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {playerColumns.map((category) => 
                        <Fragment key={`${player.id}_${category.id}`}>
                            {category.hasRating && <PlayerTableCell player={player} category={category} isItemApplied={isItemApplied} />}
                            {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                                <PlayerTableCell key={`${player.id}_${column.id}`} player={player} positions={positions} category={category} column={column} isItemApplied={isItemApplied} />
                            )}
                        </Fragment>
                    )}
                </tr>
            )}
            {players.length > 1 && averages && <tr className="duration-300 border-t-2 border-black dark:border-zinc-200 hover:bg-zinc-400/20">
                {playerColumns.map((category) => 
                    <Fragment key={`average_${category.id}`}>
                        {category.hasRating && <AverageTableCell header={header} averages={averages} category={category} isItemApplied={isItemApplied} />}
                        {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                            <AverageTableCell key={`average_${column.id}`} header={header} averages={averages} category={category} column={column} isItemApplied={isItemApplied} />
                        )}
                    </Fragment>
                )}
            </tr>}
        </tbody>
    )
}

function PlayerTableCell({ player, positions, category, column, isItemApplied }: PlayerTableCellProps) {
    if(column) {
        switch(column.id) {
            case "name":
                return (
                    <>
                        <td className="px-1.5 py-1 whitespace-nowrap">
                            {player.data.deceased && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                            <Link href={{
                                pathname: "/player/[slugOrId]",
                                query: {
                                    slugOrId: player.slug()
                                }
                            }}>
                                <a className="font-bold">{player.canonicalName()}</a>
                            </Link>
                        </td>
                        <td className="px-1.5 py-1">
                            <div className="flex flex-row">
                                <Link href={{
                                    pathname: "/player/[slugOrId]/history",
                                    query: {
                                        slugOrId: player.slug()
                                    }
                                }}>
                                    <a title={`See the history of changes for ${player.canonicalName()}`}><Emoji emoji="0x1F4CA" emojiClass="min-w-[1em] h-4 m-0.5" /></a>
                                </Link>
                                <a href={`https://blaseball.com/player/${player.id}`} title={`Go to official player page for ${player.canonicalName()}`}>
                                    <Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4 m-0.5" />
                                </a>
                            </div>
                        </td>
                    </>
                )
            case "team":
                return (
				    <td className="px-1.5 py-1 whitespace-nowrap"><PlayerTableTeam id={player.id} positions={positions} /></td>
                )
            case "position":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap"><PlayerTablePosition id={player.id} positions={positions} /></td>
                )
            case "modifications":
                return (
                    <td className="px-1.5 py-1 text-center">
                        {player.modifications().length > 0 
                            ? <ModificationList 
                                type="player" 
                                permanent={player.data.permAttr} 
                                season={player.data.seasAttr} 
                                week={player.data.weekAttr} 
                                game={player.data.gameAttr} 
                                item={(player.data.itemAttr ?? []).concat(player.oldMods)} 
                            />
                            : <>-</>
                        }
                    </td>
                )
            case "items":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">
                        <PlayerTableItems items={player.items} />
                    </td>
                )
            case "combined":
                return (
                    <PlayerStat player={player} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                )
            default:
                return (
                    <PlayerStat player={player} stat={column} hasColorScale={category.id !== "misc"} isStarRating={category.id === "sibrmetrics"} isItemApplied={isItemApplied} />
                )
        }
    } else {
        return (
            <PlayerStat player={player} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
        )
    }
}

function AverageTableCell({ header, averages, category, column, isItemApplied }: AverageTableCellProps) {
    if(column) {
        switch(column.id) {
            case "name":
                return (
                    <td colSpan={6} className="px-1.5 py-1 font-bold">{header} Average</td>
                )
            case "team":
            case "position":
            case "modifications":
            case "items":
                return <></>
            case "combined":
                return (
                    <AverageStat header={header} averages={averages} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                )
            default:
                return (
                    <AverageStat header={header} averages={averages} stat={column} hasColorScale={category.id !== "misc" || column.id === "peanutAllergy"} isStarRating={category.id === "sibrmetrics"} isItemApplied={isItemApplied} />
                )
        }
    } else {
        return (
            <AverageStat header={header} averages={averages} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
        )
    }
}

function PlayerTableTeam({ id, positions }: PlayerPositionProps) {
    if(positions) {
        const team = positions[id].team
        if(team) {
            return (
                <Link href={{
                    pathname: "/team/[slugOrId]",
                    query: {
                        slugOrId: team.slug()
                    }
                }}>
                    <a><Emoji emoji={team.data.emoji} emojiClass="inline min-w-[1em] h-4 mr-1" />
                    {team.canonicalNickname()}</a>
                </Link>
            )
        }
    }
    return <div className="text-center">-</div>
}

function PlayerTablePosition({ id, positions }: PlayerPositionProps) {
    if(positions) {
        const position = positions[id].position
        if(position) {
            return <>{position[0].toUpperCase() + position.slice(1)}</>
        }
    }
    return <>-</>
}