import Link from "next/link"
import { Fragment } from "react"
import { CategoryAttributes, ColumnAttributes, playerHistoryColumns } from "@models/columns"
import Player from "@models/player"
import Team from "@models/team"
import { EntityHistory } from "@models/api"
import Emoji from "@components/emoji"
import HistoryDate from "@components/legacy/historydate"
import AstrologyLoader from "@components/loader"
import ModificationList from "@components/legacy/modificationlist"
import PlayerStat from "@components/legacy/playerstat"
import PlayerTableItems from "@components/legacy/playertableitems"
import TableHeader from "@components/tableheader"
import Tooltip from "@components/tooltip"

type PlayerHistoryTableProps = PlayerHistoryTableBodyProps & {
    history: EntityHistory<Player>[],
    teams: Team[],
    sort?: "asc" | "desc",
    triggerSort?: Function,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerHistoryTableBodyProps = {
    history: EntityHistory<Player>[],
    teams: Team[],
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerHistoryTableCellProps = {
    snapshot: EntityHistory<Player>,
    teams: Team[],
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isItemApplied?: boolean,
}

type PlayerHistoryTeamProps = {
    player: Player,
    teams: Team[],
}

export default function PlayerHistoryTable({ history, teams, sort, triggerSort, isShowSimplified, isItemApplied }: PlayerHistoryTableProps) {
    if(!history) {
        return <AstrologyLoader />
    }
    if(!history.length) {
        return <></>
    }

    return (
        <div className="overflow-auto">
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
                                        : <TableHeader key={`header_${column.id}`} title={column.name}>{column.id === "combined" ? <Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4" /> : column.shorthand}</TableHeader>
                                )}
                            </Fragment>
                        )}
                    </tr>
                </thead>
                <PlayerHistoryTableBody history={history} teams={teams} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
            </table>
        </div>
    )
}

function PlayerHistoryTableBody({ history, teams, isShowSimplified, isItemApplied }: PlayerHistoryTableBodyProps) {
    return (
        <tbody>
            {history.map((snapshot) => 
                <tr key={snapshot.id} className="duration-300 hover:bg-zinc-400/20">
                    {playerHistoryColumns.map((category) => 
                        <Fragment key={`${snapshot.id}_${category.id}`}>
                            {category.hasRating && <PlayerHistoryTableCell snapshot={snapshot} teams={teams} category={category} isItemApplied={isItemApplied} />}
                            {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                                <PlayerHistoryTableCell key={`${snapshot.id}_${column.id}`} snapshot={snapshot} teams={teams} category={category} column={column} isItemApplied={isItemApplied} />
                            )}
                        </Fragment>
                    )}
                </tr>
            )}
        </tbody>
    )
}

function PlayerHistoryTableCell({ snapshot, teams, category, column, isItemApplied }: PlayerHistoryTableCellProps) {
    if(column) {
        switch(column.id) {
            case "date":
                return (
                    <td>
                        <Tooltip content={
                            <div className="flex flex-col">
                                <span className="font-semibold">Seen at {snapshot.date.toLocaleDateString()} {snapshot.date.toLocaleTimeString()}</span>
                                <span>Changed: {snapshot.changes.join(", ")}</span>
                            </div>
                        }>
                            <div className="px-1.5 py-1 whitespace-nowrap">
                                <HistoryDate date={snapshot.date} />
                            </div>
                        </Tooltip>
                    </td>
                )
            case "name":
                return (
                    <td className="px-1.5 py-1 whitespace-nowrap">
                        {snapshot.data.data.deceased && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                        <span>{snapshot.data.data.name}</span>
                    </td>
                )
            case "team":
                return (
				    <td className="px-1.5 py-1 whitespace-nowrap"><PlayerHistoryTeam player={snapshot.data} teams={teams} /></td>
                )
            case "modifications":
                return (
                    <td className="px-1.5 py-1 text-center">
                        {snapshot.data.modifications().length > 0 
                            ? <ModificationList 
                                type="player" 
                                permanent={snapshot.data.data.permAttr} 
                                season={snapshot.data.data.seasAttr} 
                                week={snapshot.data.data.weekAttr} 
                                game={snapshot.data.data.gameAttr} 
                                item={(snapshot.data.data.itemAttr ?? []).concat(snapshot.data.oldMods)} 
                            />
                            : <>-</>
                        }
                    </td>
                )
            case "items":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">
                        <PlayerTableItems items={snapshot.data.items} />
                    </td>
                )
            case "combined":
                return (
                    <PlayerStat player={snapshot.data} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                )
            default:
                return (
                    <PlayerStat player={snapshot.data} stat={column} hasColorScale={category.id !== "misc"} isStarRating={category.id === "sibrmetrics"} isItemApplied={isItemApplied} />
                )
        }
    } else {
        return (
            <PlayerStat player={snapshot.data} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
        )
    }
}

function PlayerHistoryTeam({ player, teams }: PlayerHistoryTeamProps) {
    const team = teams.find((team) => team.id === player.data.leagueTeamId)
    if(team) {
        return (
            <Link href={{
                pathname: "/legacy/team/[slugOrId]",
                query: {
                    slugOrId: team.slug()
                }
            }}>
                <a><Emoji emoji={team.data.emoji} emojiClass="inline min-w-[1em] h-4 mr-1" />
                {team.canonicalNickname()}</a>
            </Link>
        )
    }
    return <div className="text-center">-</div>
}