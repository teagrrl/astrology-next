import Link from "next/link";
import { Fragment } from "react";
import { CategoryAttributes, ColumnAttributes, squeezerColumns } from "@models/columns";
import Team from "@models/team";
import { Averages } from "@legacyapi/chronicler";
import AverageStat from "./averagestat";
import Emoji from "@components/emoji";
import ModificationList from "@components/legacy/modificationlist";
import StatTableHeader, { StatTableHeaderProps } from "@components/legacy/stattableheader";

type SqueezerTableProps = SqueezerTableBodyProps & StatTableHeaderProps

type SqueezerTableBodyProps = {
    teams: Team[],
    averages: Record<string, Averages>,
    ranks: Record<string, number>,
    isItemApplied?: boolean,
    isShowSimplified?: boolean,
}

type SqueezerTableCellProps = {
    team: Team,
    averages: Record<string, Averages>,
    ranks: Record<string, number>,
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

export default function SqueezerTable({teams, averages, ranks, sort, direction, triggerSort, isItemApplied, isShowSimplified}: SqueezerTableProps) {
    if(!teams || !averages) {
        return <h1 className="flex justify-center text-xl">Loading...</h1>
    }
    if(!teams.length) {
        return <h1 className="flex justify-center text-xl">We&apos;re sorry but we could not find any teams to squeeze in this universe.</h1>
        }
    return (
        <div className="overflow-auto">
            <table className="table-auto">
                <StatTableHeader columns={squeezerColumns} sort={sort} direction={direction} triggerSort={triggerSort} isShowSimplified={isShowSimplified} />
                <SqueezerTableBody teams={teams} averages={averages} ranks={ranks} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
            </table>
        </div>
    )
}


function SqueezerTableBody({ teams, averages, ranks, isShowSimplified, isItemApplied }: SqueezerTableBodyProps) {
    return (
        <tbody>
            {teams.map((team) => 
                <tr key={team.id} className="duration-300 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {squeezerColumns.map((category) => 
                        <Fragment key={`${team.id}_${category.id}`}>
                            {category.hasRating && <SqueezerTableCell team={team} averages={averages} ranks={ranks} category={category} isItemApplied={isItemApplied} />}
                            {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                                <SqueezerTableCell key={`${team.id}_${column.id}`} team={team} averages={averages} ranks={ranks} category={category} column={column} isItemApplied={isItemApplied} />
                            )}
                        </Fragment>
                    )}
                </tr>
            )}
        </tbody>
    )
}

function SqueezerTableCell({ team, averages, ranks, category, column, isItemApplied }: SqueezerTableCellProps) {
    if(column) {
        switch(column.id) {
            case "name":
                return (
                    <>
                        <td className="px-1.5 py-1 whitespace-nowrap">
                            {false && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                            <Link href={{
                                pathname: "/legacy/team/[slugOrId]",
                                query: {
                                    slugOrId: team.slug()
                                }
                            }}>
                                <a className="font-bold">{team.canonicalName()}</a>
                            </Link>
                        </td>
                        <td className="px-1.5 py-1">
                            <a href={`https://blaseball.com/team/${team.id}`} title={`Go to official team page for the ${team.canonicalName()}`}>
                                <Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4" />
                            </a>
                        </td>
                    </>
                )
            case "rank":
                return (
				    <td className="px-1.5 py-1 text-center">
                        {ranks ? ranks[team.id] + 1 : "N/A"}
                    </td>
                )
            case "modifications":
                return (
                    <td className="px-1.5 py-1 text-center">
                        {team.modifications().length > 0 
                            ? <ModificationList 
                                type="team" 
                                permanent={team.data.permAttr} 
                                season={team.data.seasAttr} 
                                week={team.data.weekAttr} 
                                game={team.data.gameAttr} 
                            />
                            : <>-</>
                        }
                    </td>
                )
            case "combined":
                return (
                    <AverageStat header={team.canonicalName()} averages={averages[team.id].roster} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                )
            default:
                return (
                    <AverageStat header={team.canonicalName()} averages={averages[team.id].roster} stat={column} hasColorScale={column.id === "peanutAllergy" || category.id !== "misc"} isStarRating={category.id === "sibrmetrics"} isItemApplied={isItemApplied} />
                )
        }
    } else {
        return (
            <AverageStat header={team.canonicalName()} averages={averages[team.id].roster} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
        )
    }
}