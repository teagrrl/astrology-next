import { Fragment } from "react"
import Link from "next/link"
import { PlayerSnapshot } from "@models/player2"
import { CategoryAttributes, ColumnAttributes, playerHistoryColumns } from "@models/columns2"
import AstrologyLoader from "@components/loader"
import Emoji from "@components/emoji"
import Tooltip from "@components/tooltip"
import TableStatCell from "@components/tablestatcell"
import TableHeader from "@components/tableheader"
import ModificationList from "@components/modificationlist"
import moment from "moment"
import HeatMap from "./heatmap"

type PlayerHistoryTableProps = PlayerHistoryTableBodyProps & {
    sort?: "asc" | "desc",
    triggerSort?: Function,
}

type PlayerHistoryTableBodyProps = {
    snapshots?: PlayerSnapshot[],
    isShowColors?: boolean,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
    scaleColors?: string[],
}

type PlayerHistoryTableCellProps = {
    snapshot: PlayerSnapshot,
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isShowColors?: boolean,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
    scaleColors?: string[],
}

export default function PlayerHistoryTable({ snapshots, sort, triggerSort, isShowColors, isShowSimplified, isItemApplied, scaleColors }: PlayerHistoryTableProps) {
    if(!snapshots) {
        return <AstrologyLoader />
    }
    if(!snapshots.length) {
        return <></>
    }
    return (
        <div className="overflow-auto mb-4">
            <table className="table-auto">
                {playerHistoryColumns.map((category) => 
                    (category.isSimple || category.hasRating || !isShowSimplified) && <colgroup key={category.id} span={(category.hasRating ? 1 : 0) + (category.isSimple || !isShowSimplified ? category.columns.length : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
                )}
                <thead>
                    <tr className="border-b-[1px] border-black dark:border-zinc-500">
                        {playerHistoryColumns.map((category) => 
                            (category.isSimple || category.hasRating || !isShowSimplified) && <TableHeader key={`header_${category.id}`} colSpan={(category.hasRating ? 1 : 0) + (category.isSimple || !isShowSimplified ? category.columns.length : 0)}>{category.name}</TableHeader>
                        )}
                    </tr>
                    <tr className="border-b-[1px] border-black dark:border-zinc-500">
                        {playerHistoryColumns.map((category) => 
                            <Fragment key={`header_${category.id}`}>
                                {category.hasRating && <TableHeader title={`${category.name} Stars`} sortId={category.id} ><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></TableHeader>}
                                {(category.isSimple || !isShowSimplified) && category.columns.map((column) => 
                                    column.id === "date"
                                        ? <TableHeader key="header_date" sortId="date" sortBy={{ id: "date", direction: sort }} triggerSort={triggerSort} title={sort === "asc" ? "Oldest First" : "Newest First"}>Date</TableHeader>
                                        : <TableHeader key={`header_${column.id}`} title={column.name}>{column.name}</TableHeader>
                                )}
                            </Fragment>
                        )}
                    </tr>
                </thead>
                <PlayerHistoryTableBody snapshots={snapshots} isShowColors={isShowColors} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} scaleColors={scaleColors} />
            </table>
        </div>
    )
}

function PlayerHistoryTableBody({ snapshots, isShowColors, isShowSimplified, isItemApplied, scaleColors }: PlayerHistoryTableBodyProps) {
    return (
        <tbody>
            {snapshots?.map((snapshot) => 
                <tr key={snapshot.id} className="duration-300 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {playerHistoryColumns.map((category) => 
                        <Fragment key={`${snapshot.id}_${category.id}`}>
                            {category.hasRating && <PlayerHistoryTableCell snapshot={snapshot} category={category} isShowColors={isShowColors} isItemApplied={isItemApplied} isShowSimplified={isShowSimplified} scaleColors={scaleColors} />}
                            {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                                <PlayerHistoryTableCell key={`${snapshot.id}_${column.id}`} snapshot={snapshot} category={category} column={column} isShowColors={isShowColors} isItemApplied={isItemApplied} isShowSimplified={isShowSimplified} scaleColors={scaleColors} />
                            )}
                        </Fragment>
                    )}
                </tr>
            )}
        </tbody>
    )
}

function PlayerHistoryTableCell({ snapshot, category, column, isShowColors, isItemApplied, isShowSimplified, scaleColors }: PlayerHistoryTableCellProps) {
    if(column) {
        switch(column.id) {
            case "date":
                return (
                    <td className="px-1.5 py-1 whitespace-nowrap">
                        <Tooltip content={<><span className="font-semibold">Changes:</span> {snapshot.changes.join(", ")}</>}>
                            <span>{moment(snapshot.date).format("LLL")}</span>
                        </Tooltip>
                    </td>
                )
            case "name":
                return (
                    <td className="px-1.5 py-1 whitespace-nowrap">{snapshot.player.name}</td>
                )
            case "team":
                return (
				    <td className="px-1.5 py-1">
                        <span className="flex flex-row whitespace-nowrap">
                            {snapshot.player.team 
                                ? <Link href={{
                                    pathname: "/team/[id]",
                                    query: {
                                        id: snapshot.player.team.id
                                    }
                                }}>
                                    <a className="flex items-center gap-1">
                                        <Emoji 
                                            emoji={snapshot.player.team.emoji} 
                                            emojiClass="w-4 h-4" 
                                            className="h-7 w-7 flex justify-center items-center rounded-full"
                                            style={{ backgroundColor: snapshot.player.team.primaryColor }}
                                        />
                                        <span className="font-semibold">{snapshot.player.team.name}</span>
                                    </a>
                                </Link>
                                : <span className="flex items-center gap-1">
                                    <Emoji 
                                        emoji={"0x1F300"} 
                                        emojiClass="w-4 h-4 saturate-0 brightness-200" 
                                        className="h-7 w-7 flex justify-center items-center rounded-full bg-slate-700"
                                    />
                                    <span className="font-semibold">Black Hole</span>
                                </span>
                            }
                        </span>
                    </td>
                )
            case "location":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">
                        <Tooltip content={<div><HeatMap header="Heat Map" values={snapshot.player.heatMaps} /></div>}>
                            <span>{snapshot.player.rosterSlots.length ? snapshot.player.rosterSlots.map((slot) => slot.name) : "SOMEWHERE"}</span>
                        </Tooltip>
                    </td>
                )
            case "position":
                // TODO: draw the triangles out correctly
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">
                        {snapshot.player.positions.length 
                            ? snapshot.player.positions.map((position, index) => <div key={`pos_${index}`}>
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
                        {snapshot.player.modifications.length > 0 
                            ? <ModificationList modifications={snapshot.player.modifications} />
                            : "-"
                        }
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
                    <TableStatCell header={snapshot.player.name} values={/*isShowSimplified ? player.stars : */snapshot.player.attributes} statId={"overall"} statName={"Overall Rating"} isRating={true} isShowColors={isShowColors} scaleColors={scaleColors} />
                )
            default:
                return (
                    <TableStatCell header={snapshot.player.name} values={snapshot.player.attributes} statId={column.id} statName={column.name} isShowColors={isShowColors} scaleColors={scaleColors} />
                )
        }
    } else {
        return (
            <TableStatCell header={snapshot.player.name} values={/*isShowSimplified ? player.stars : */snapshot.player.attributes} statId={category.id} statName={category.name} isRating={true} isShowColors={isShowColors} scaleColors={scaleColors} />
        )
    }
}