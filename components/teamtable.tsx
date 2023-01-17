import { Fragment } from "react"
import Link from "next/link"
import { CategoryAttributes, ColumnAttributes, teamColumns } from "@models/columns2"
import Team from "@models/team2"
import Emoji from "@components/emoji"
import StatTableHeader, { StatTableHeaderProps } from "@components/stattableheader"
import TableStatCell from "@components/tablestatcell"

type TeamTableProps = TeamTableBodyProps & StatTableHeaderProps

type TeamTableBodyProps = {
    teams: Team[],
    isItemApplied?: boolean,
    isShowSimplified?: boolean,
}

type TeamTableCellProps = {
    team: Team,
    category: CategoryAttributes,
    column?: ColumnAttributes,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

export default function TeamTable({teams, sort, direction, triggerSort, isItemApplied, isShowSimplified}: TeamTableProps) {
    if(!teams) {
        return <h1 className="flex justify-center text-xl">Loading...</h1>
    }
    if(!teams.length) {
        return <h1 className="flex justify-center text-xl">We&apos;re sorry but we could not find any teams to squeeze in this universe.</h1>
        }
    return (
        <div className="overflow-auto mb-4">
            <table className="table-auto">
                <StatTableHeader columns={teamColumns} sort={sort} direction={direction} triggerSort={triggerSort} isShowSimplified={isShowSimplified} />
                <TeamTableBody teams={teams} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
            </table>
        </div>
    )
}


function TeamTableBody({ teams, isShowSimplified, isItemApplied }: TeamTableBodyProps) {
    return (
        <tbody>
            {teams.map((team) => 
                <tr key={team.id} className="duration-300 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {teamColumns.map((category) => 
                        <Fragment key={`${team.id}_${category.id}`}>
                            {category.hasRating && <TeamTableCell team={team} category={category} isItemApplied={isItemApplied} isShowSimplified={isShowSimplified} />}
                            {(category.id === "general" || !isShowSimplified) && category.columns.map((column) => 
                                <TeamTableCell key={`${team.id}_${column.id}`} team={team} category={category} column={column} isItemApplied={isItemApplied} isShowSimplified={isShowSimplified} />
                            )}
                        </Fragment>
                    )}
                </tr>
            )}
        </tbody>
    )
}

function TeamTableCell({ team, category, column, isItemApplied, isShowSimplified }: TeamTableCellProps) {
    if(column) {
        switch(column.id) {
            case "name":
                return (
                    <td className="px-1.5 py-1">
                        <Link href={{
                            pathname: "/team/[id]",
                            query: {
                                id: team.id
                            }
                        }}>
                            <a className="flex flex-row items-center gap-2 w-fit">
                                <Emoji 
                                    emoji={team.emoji} 
                                    emojiClass="w-4 h-4" 
                                    className="h-7 w-7 flex justify-center items-center rounded-full"
                                    style={{ backgroundColor: team.primaryColor }}
                                />
                                <span className="font-bold whitespace-nowrap"> {team.name}</span>
                            </a>
                        </Link>
                    </td>
                )
            case "division":
                return (
                    <td className="px-1.5 py-1 text-center whitespace-nowrap">{team.division}</td>
                )
            case "wins":
                return (
                    <td className="px-1.5 py-1 text-center">{team.standings.reduce((wins, standings) => wins + standings.wins, 0)}</td>
                )
            case "losses":
                return (
                    <td className="px-1.5 py-1 text-center">{team.standings.reduce((losses, standings) => losses + standings.losses, 0)}</td>
                )
            /*case "modifications":
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
                )*/
            case "overall":
                return (
                    <TableStatCell header={team.name} values={team.averages} statId={"overall"} statName={"Overall Rating"} isRating={true} />
                )
            default:
                return (
                    <TableStatCell header={team.name} values={team.averages} statId={column.id} statName={column.name} />
                )
        }
    } else {
        return (
            <TableStatCell header={team.name} values={isShowSimplified ? team.stars : team.averages} statId={category.id} statName={category.name} isRating={true} />
        )
    }
}