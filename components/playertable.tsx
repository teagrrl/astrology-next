import { Fragment } from "react"
import Link from "next/link"
import Player from "@models/player2"
import { CategoryAttributes, ColumnAttributes, playerColumns } from "@models/columns2"
import AstrologyLoader from "@components/loader"
import Emoji from "@components/emoji"
import StatTableHeader, { StatTableHeaderProps } from "@components/stattableheader"
import Tooltip from "@components/tooltip"
import TableStatCell from "@components/tablestatcell"

type PlayerTableProps = PlayerTableBodyProps & StatTableHeaderProps & {
    //exportData?: ExportCSVProps,
}

type PlayerTableBodyProps = {
    header?: string,
    players: Player[],
    averages?: Record<string, number>,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerTableCellProps = {
    player: Player,
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type AverageTableCellProps = {
    header?: string,
    averages: Record<string, number>,
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isItemApplied?: boolean,
}

export default function PlayerTable({ header, players, averages, sort, direction, triggerSort, isShowSimplified, isItemApplied/*, exportData*/ }: PlayerTableProps) {
    if(!players) {
        return <AstrologyLoader />
    }
    if(!players.length) {
        return <></>
    }
    return (
        <>
            {(header/* || exportData*/) && <div className="flex flex-row justify-end p-2">
                {!!header && <h1 className="flex grow justify-center text-2xl font-bold">{header}</h1>}
                {/*exportData && <ExportCSV {...exportData} />*/}
            </div>}
            <div className="overflow-auto mb-4">
                <table className="table-auto">
                    <StatTableHeader sort={sort} direction={direction} triggerSort={triggerSort} isShowSimplified={isShowSimplified} />
                    <PlayerTableBody header={header} players={players} averages={averages} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
                </table>
            </div>
        </>
    )
}

function PlayerTableBody({ header, players, averages, isShowSimplified, isItemApplied }: PlayerTableBodyProps) {
    return (
        <tbody>
            {players.map((player) => 
                <tr key={player.id} className="duration-300 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {playerColumns.map((category) => 
                        <Fragment key={`${player.id}_${category.id}`}>
                            {category.hasRating && <PlayerTableCell player={player} category={category} isItemApplied={isItemApplied} isShowSimplified={isShowSimplified} />}
                            {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                                <PlayerTableCell key={`${player.id}_${column.id}`} player={player} category={category} column={column} isItemApplied={isItemApplied} isShowSimplified={isShowSimplified} />
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

function AverageTableCell({ header, averages, category, column, isItemApplied }: AverageTableCellProps) {
    if(column) {
        switch(column.id) {
            case "team":
                return (
                    <td colSpan={4} className="px-1.5 py-1 font-bold">{header} Average</td>
                )
            case "name":
            case "location":
            case "position":
                return (
                    <></>
                )
            default:
                return (
                    <TableStatCell header={header} values={averages} statId={column.id} statName={column.name} isRating={column.id === "overall"} />
                )
        }
    } else {
        return (
            <TableStatCell header={header} values={averages} statId={category.id} statName={category.name} isRating={true} />
        )
    }
}

function PlayerTableCell({ player, category, column, isItemApplied, isShowSimplified }: PlayerTableCellProps) {
    if(column) {
        switch(column.id) {
            case "name":
                return (
                    <>
                        <td className="px-1.5 py-1 whitespace-nowrap">
                            {/*player.data.deceased && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />*/}
                            {/*<Link href={{
                                pathname: "/player/[id]",
                                query: {
                                    id: player.id
                                }
                            }}>
                                <a className="font-bold">{player.name}</a>
                            </Link>*/}
                            <span className="font-bold">{player.name}</span>
                        </td>
                    </>
                )
            case "team":
                return (
				    <td className="px-1.5 py-1">
                        <Link href={{
                            pathname: "/team/[id]",
                            query: {
                                id: player.team.id
                            }
                        }}>
                            <a className="flex justify-center" title={player.team.name}>
                                <Emoji 
                                    emoji={player.team.emoji} 
                                    emojiClass="w-4 h-4" 
                                    className="h-7 w-7 flex justify-center items-center rounded-full"
                                    style={{ backgroundColor: player.team.primaryColor }}
                                />
                            </a>
                        </Link>
                    </td>
                )
            case "location":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">{player.rosterSlots.map((slot) => slot.location)}</td>
                )
            case "position":
                // TODO: draw the triangles out correctly
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">
                        {player.positions.length 
                            ? player.positions.map((position, index) => <div key={`pos_${index}`}>
                                <Tooltip content={
                                    <div>
                                        <svg width={64} height={40}>
                                            <g transform="translate(10, 2)">
                                                <g transform="scale(1, 0.6)">
                                                    <g transform="rotate(-45, 32, 24)">
                                                        <rect width={42} height={42} stroke="black" fill="#eeeeee" />
                                                        <rect y={21} width={21} height={21} fill="#bbbbbb" />
                                                        <rect x={position.x * 7} y={(5 - position.y) * 7} width={7} height={7} stroke="black" fill="white" />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                }>
                                    <span>{position.name}</span>
                                </Tooltip>
                            </div>)
                            : <span>Somewhere</span>
                        }
                    </td>
                )
            case "modifications":
                return (
                    <td className="px-1.5 py-1 text-center">
                        -
                    </td>
                )
            case "items":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">
                        -
                    </td>
                )
            case "overall":
                return (
                    <TableStatCell header={player.name} values={isShowSimplified ? player.stars : player.attributes} statId={"overall"} statName={"Overall Rating"} isRating={true} />
                )
            default:
                return (
                    <TableStatCell header={player.name} values={player.attributes} statId={column.id} statName={column.name} />
                )
        }
    } else {
        return (
            <TableStatCell header={player.name} values={isShowSimplified ? player.stars : player.attributes} statId={category.id} statName={category.name} isRating={true} />
        )
    }
}