import Link from "next/link"
import Ballpark from "../models/ballpark"
import { ballparkColumns } from "../models/columns"
import Team from "../models/team"
import Emoji from "./emoji"
import ModificationList from "./modificationlist"
import TableHeader from "./tableheader"
import Tooltip from "./tooltip"

type BallparkTableProps = {
    ballparks?: Ballpark[],
    teams?: Team[]
    sort?: string,
    direction?: "asc" | "desc",
    triggerSort?: Function,
}

type BallparkTableDataProps = {
    ballparks: Ballpark[],
    teams: Team[],
}

type BallparkTableCellProps = {
    ballpark: Ballpark,
    teams: Team[],
    id: string,
    name?: string,
}

type BallparkTableTeamProps = {
    id: string,
    teams: Team[],
}

type BallparkStatProps = {
    ballpark: string,
    name: string,
    value: number | string,
    details?: number | string,
    scaleClass?: string,
}

export default function BallparkTable({ ballparks, teams, sort, direction, triggerSort }: BallparkTableProps) {
    if(!ballparks || !teams) {
        return (
            <h1>Loading...</h1>
        )
    }
    return (
        <table className="table-auto">
            {ballparkColumns.map((category) => 
                <colgroup key={category.id} span={category.columns.length} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
            )}
            <thead>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    {ballparkColumns.map((category) => 
                        <TableHeader key={`header_${category.id}`} colSpan={category.columns.length}>{category.name}</TableHeader>
                    )}
                </tr>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    {ballparkColumns.map((category) => 
                        category.columns.map((column) => 
                            <TableHeader key={`header_${column.id}`} title={column.name} sortId={column.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>{column.shorthand}</TableHeader>
                        )
                    )}
                </tr>
            </thead>
            <BallparkTableBody ballparks={ballparks} teams={teams} />
        </table>
    )
}

function BallparkTableBody({ ballparks, teams }: BallparkTableDataProps) {
    return (
        <tbody>
            {ballparks.map((ballpark) => 
                <tr key={ballpark.id} className="duration-300 even:bg-zinc-300/20 dark:even:bg-zinc-600/20 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {ballparkColumns.map((category) => 
                        category.columns.map((column) => 
                            <BallparkTableCell key={`${ballpark.id}_${column.id}`} ballpark={ballpark} teams={teams} id={column.id} name={column.name} />
                        )
                    )}
                </tr>
            )}
        </tbody>
    )
}

function BallparkTableCell({ ballpark, teams, id, name }: BallparkTableCellProps) {
    switch(id) {
        case "name":
            return (
                <td className="px-1.5 py-1 whitespace-nowrap">
                    <Tooltip content={<div className="font-bold">{ballpark.data.name}</div>}>
                        <span>
                            <Link href={{
                                pathname: "/ballpark/[slugOrId]",
                                query: {
                                    slugOrId: ballpark.id
                                }
                            }}>
                                <a className="font-bold">{ballpark.data.nickname}</a>
                            </Link>
                        </span>
                    </Tooltip>
                </td>
            )
        case "team":
            return (
                <td className="px-1.5 py-1 whitespace-nowrap">
                    <BallparkTableTeam id={ballpark.data.teamId} teams={teams} />
                </td>
            )
        case "modifications":
            return (
                <td className="px-1.5 py-1">
                    {ballpark.data.mods.length > 0 
                        ? <ModificationList 
                            type="ballpark" 
                            permanent={ballpark.data.mods} 
                        /> 
                        : <span>-</span>
                    }
                </td>
            )
        case "weather":
            return (
                <td className="text-center">
                    {ballpark.weather().length > 0 
                        ? <ul className="flex flex-row gap-1.5 justify-center">
                            {ballpark.weather().map((weather) => 
                                <Tooltip key={weather.data.name} maxWidth={200} content={
                                    <div>
                                        <div className="font-semibold"><Emoji emoji={weather.data.emoji} emojiClass="inline h-4 h-4 mr-0.5 align-[-0.1em]" /> {weather.data.name} +{weather.frequency}</div>
                                        {weather.data.description && <div>{weather.data.description}</div>}
                                    </div>
                                }>
                                    <li>
                                        <Emoji emoji={weather.data.emoji} className="px-1.5 py-1 rounded-md" style={{ backgroundColor: weather.data.background }} emojiClass="inline min-w-[1em] h-4 align-[-0.1em]" />
                                    </li>
                                </Tooltip>
                            )}
                        </ul>
                        : <span>-</span>
                    }
                </td>
            )
        case "type":
            return (
                <td className="px-1.5 py-1 text-center">
                    {ballpark.prefab() === null
                        ? <div>None</div>
                        : <Tooltip content={ballpark.prefab()?.description}>
                            <div>{ballpark.prefab()?.name}</div>
                        </Tooltip>
                    }
                </td>
            )
        case "birds":
            return (
                <BallparkStat ballpark={ballpark.data.nickname} name="Birds" value={ballpark.data.birds ?? 0} />
            )
        case "filthiness":
            return (
                <BallparkStat ballpark={ballpark.data.nickname} name={name ?? ucFirst(id)} value={ballpark.filthiness()} details={ballpark.data.filthiness} />
            )
        case "luxuriousness":
            return (
                <BallparkStat ballpark={ballpark.data.nickname} name={name ?? ucFirst(id)} value={ballpark.luxuriousness()} details={ballpark.data.luxuriousness} />
            )
        case "hype":
            return (
                <BallparkStat ballpark={ballpark.data.nickname} name={name ?? ucFirst(id)} value={ballpark.hype()} details={ballpark.data.hype} />
            )
        default:
            return (
                <BallparkStat ballpark={ballpark.data.nickname} name={name ?? ucFirst(id)} value={ballpark.getStat(id) ?? 0} />
            )
    }
}

function BallparkTableTeam({ id, teams }: BallparkTableTeamProps) {
    if(teams) {
        const team = teams.find((team) => team.id === id)
        if(team) {
            return (
                <Link href={{
                    pathname: "/team/[slugOrId]",
                    query: {
                        slugOrId: team.slug()
                    }
                }}>
                    <a><Emoji emoji={team.data.emoji} emojiClass="inline min-w-[1em] h-4 align-[-0.1em] mr-1" />
                    {team.canonicalNickname()}</a>
                </Link>
            )
        }
    }
    return <div className="text-center">-</div>
}

function BallparkStat({ ballpark, name, value, details }: BallparkStatProps) {
    return (
        <td>
            <Tooltip
                content={
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-bold">{ballpark}</div>
                        <div>
                            <span className="font-semibold">{name}: </span>
                            <span>{details ?? value}</span>
                        </div>
                    </div>
                }
            >
                <div className="px-1.5 py-1 text-center">{typeof value === "number" ? Math.round(1000 * value) / 1000 : value}</div>
            </Tooltip>
        </td>
    )
}

function ucFirst(str: string) {
    return str[0].toUpperCase() + str.slice(1)
}