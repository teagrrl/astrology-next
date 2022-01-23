import Link from "next/link"
import { Fragment } from "react"
import { columns } from "../models/columns"
import Player from "../models/player"
import Team from "../models/team"
import { EntityHistory } from "../pages/api/chronicler"
import Emoji from "./emoji"
import HistoryDate from "./historydate"
import AstrologyLoader from "./loader"
import ModificationList from "./modificationlist"
import PlayerStat from "./playerstat"
import PlayerTableItems from "./playertableitems"
import TableHeader from "./tableheader"
import Tooltip from "./tooltip"

type PlayerHistoryTableProps = {
    history: EntityHistory<Player>[],
    teams: Team[],
    sort?: "asc" | "desc",
    triggerSort?: Function,
    isShowSimplified?: boolean,
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
                <colgroup span={(isShowSimplified ? 0 : columns.sibrmetrics.length) + 6} className="border-r-2 border-black dark:border-white"></colgroup>
                {columns.categories.map((category) => 
                    isShowSimplified 
                        ? (category.hasRating || category.id === "misc") && <colgroup key={`colgroup_${category.id}`} span={category.id === "misc" ? 3 : 1} className="border-black dark:border-white last-of-type:border-l-2"></colgroup>
                        : <colgroup key={`colgroup_${category.id}`} span={category.attributes.length + (category.id === "misc" ? 3 : 0) + (category.hasRating ? 1 : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
                )}
                <thead>
                    <tr className="border-b-[1px] border-black dark:border-zinc-500">
                        <TableHeader colSpan={(isShowSimplified ? 0 : columns.sibrmetrics.length) + 6}>General</TableHeader>
                        {columns.categories.map((category) =>
                            isShowSimplified 
                                ? (category.hasRating || category.id === "misc") && <TableHeader key={`header_${category.id}`} colSpan={category.id === "misc" ? 3 : 1}>{category.name}</TableHeader>
                                : <TableHeader key={`header_${category.id}`} colSpan={category.attributes.length + (category.id === "misc" ? 3 : 0) + (category.hasRating ? 1 : 0)}>{category.name}</TableHeader>
                        )}
                    </tr>
                    <tr className="border-b-[1px] border-black dark:border-zinc-500">
                        <TableHeader sortId="date" sortBy={{ id: "date", direction: sort }} triggerSort={triggerSort} title={sort === "asc" ? "Oldest First" : "Newest First"}>Date</TableHeader>
                        <TableHeader title="Player Name">Name</TableHeader>
                        <TableHeader title="Player Team">Team</TableHeader>
                        <TableHeader title="Player Modifications">Modifications</TableHeader>
                        <TableHeader title="Player Items">Items</TableHeader>
                        {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) => 
                            <TableHeader key={sibrmetric.id} title={sibrmetric.name}>{sibrmetric.shorthand}</TableHeader>
                        )}
                        <TableHeader title="Combined Stars"><Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4" /></TableHeader>
                        {columns.categories.map((category) =>
                            <Fragment key={`subheader_${category.id}`}>
                                {category.hasRating && <TableHeader title={`${category.name} Stars`}><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></TableHeader>}
                                {category.id === "misc" && <>
                                    <TableHeader title="Pregame Ritual">ritual</TableHeader>
                                    <TableHeader title="Coffee Style">coffee</TableHeader>
                                    <TableHeader title="Blood Type">blood</TableHeader>
                                </>}
                                {!isShowSimplified && category.attributes.map((attribute) =>
                                    <TableHeader key={`subheader_${attribute.id}`} title={attribute.name}>{attribute.shorthand}</TableHeader>
                                )}
                            </Fragment>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {history.map((snapshot) => 
                        <tr key={snapshot.id} className="duration-300 hover:bg-zinc-400/20">
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
                            <td className="px-1.5 py-1 whitespace-nowrap">
                                {snapshot.data.data.deceased && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                                <span>{snapshot.data.data.name}</span>
                            </td>
                            <td className="px-1.5 py-1 whitespace-nowrap"><PlayerHistoryTeam player={snapshot.data} teams={teams} /></td>
                            <td className="px-1.5 py-1 text-center">
                                {snapshot.data.modifications().length > 0 
                                    ? <ModificationList 
                                        type="player" 
                                        permanent={snapshot.data.data.permAttr} 
                                        season={snapshot.data.data.seasAttr} 
                                        week={snapshot.data.data.weekAttr} 
                                        game={snapshot.data.data.gameAttr} 
                                        item={snapshot.data.data.itemAttr} 
                                    />
                                    : <>-</>
                                }
                            </td>
                            <td className="px-1.5 py-1 text-center whitespace-nowrap">
                                <PlayerTableItems items={snapshot.data.items} />
                            </td>
                            {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) =>
                                <PlayerStat key={`${snapshot.data.id}_${sibrmetric.id}`} player={snapshot.data} stat={sibrmetric} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                            )}
                            <PlayerStat player={snapshot.data} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                            {columns.categories.map((category) =>
                                <Fragment key={`${snapshot.data.id}_${category.id}`}>
                                    {category.hasRating && <PlayerStat player={snapshot.data} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />}
                                    {category.id === "misc" && <>
                                        <PlayerStat player={snapshot.data} id="ritual" />
                                        <PlayerStat player={snapshot.data} id="coffee" />
                                        <PlayerStat player={snapshot.data} id="blood" />
                                    </>}
                                    {!isShowSimplified && category.attributes.map((attribute) => 
                                        <PlayerStat key={`${snapshot.data.id}_${attribute.id}`} player={snapshot.data} stat={attribute} hasColorScale={category.id !== "misc"} isItemApplied={isItemApplied} />
                                    )}
                                </Fragment>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

function PlayerHistoryTeam({ player, teams }: PlayerHistoryTeamProps) {
    const team = teams.find((team) => team.id === player.data.leagueTeamId)
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
    return <div className="text-center">-</div>
}