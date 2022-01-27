import Link from "next/link"
import Ballpark, { ballparkAttributeIds } from "../models/ballpark"
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
            <colgroup span={5} className="border-r-2 border-black dark:border-white"></colgroup>
            <colgroup span={ballparkAttributeIds.length} className="border-r-2 border-black dark:border-white"></colgroup>
            <colgroup span={3} className="border-r-2 border-black dark:border-white"></colgroup>
            <colgroup span={3}></colgroup>
            <thead>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    <TableHeader colSpan={5}>General</TableHeader>
                    <TableHeader colSpan={ballparkAttributeIds.length}>Stats</TableHeader>
                    <TableHeader colSpan={3}>Condition</TableHeader>
                    <TableHeader colSpan={3}>Miscellaneous</TableHeader>
                </tr>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    <TableHeader title="Ballpark Nickname" sortId="name" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Name</TableHeader>
                    <TableHeader title="Ballpark Home Team"><span className="whitespace-nowrap">Home Team</span></TableHeader>
                    <TableHeader title="Ballpark Modifications" sortId="modifications" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Modifications</TableHeader>
                    <TableHeader title="Ballpark Weather" sortId="weather" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Weather</TableHeader>
                    <TableHeader title="Ballpark Type" sortId="prefab" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Type</TableHeader>
                    {ballparkAttributeIds.map((id) => 
                        <TableHeader key={`header_${id}`}title={`Ballpark ${ucFirst(id)}`} sortId={id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>{id}</TableHeader>
                    )}
                    <TableHeader title="Ballpark Filthiness" sortId="filthiness" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Filthiness</TableHeader>
                    <TableHeader title="Ballpark Luxuriousness" sortId="luxuriousness" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Luxuriousness</TableHeader>
                    <TableHeader title="Ballpark Hype" sortId="hype" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Hype</TableHeader>
                    <TableHeader title="Ballpark Birds" sortId="birds" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Birds</TableHeader>
                    <TableHeader title="Ballpark Air Balloons" sortId="airBalloons" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}><span className="whitespace-nowrap">Air Balloons</span></TableHeader>
                    <TableHeader title="Ballpark Balloons" sortId="floodBalloons" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}><span className="whitespace-nowrap">Flood Balloons</span></TableHeader>
                </tr>
            </thead>
            <tbody>
                {ballparks.map((ballpark) => 
                    <tr key={ballpark.id} className="duration-300 even:bg-zinc-300/20 dark:even:bg-zinc-600/20 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
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
                        <td className="px-1.5 py-1 whitespace-nowrap">
                            <BallparkTableTeam id={ballpark.data.teamId} teams={teams} />
                        </td>
                        <td className="px-1.5 py-1">
                            {ballpark.data.mods.length > 0 
                                ? <ModificationList 
                                    type="ballpark" 
                                    permanent={ballpark.data.mods} 
                                /> 
                                : <span>-</span>
                            }
                        </td>
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
                        <td className="px-1.5 py-1 text-center">{ballpark.prefab()}</td>
                        {ballparkAttributeIds.map((id) => 
                            <BallparkStat key={`${ballpark.id}_${id}`} ballpark={ballpark.data.nickname} name={ucFirst(id)} value={ballpark.getStat(id) ?? 0} />
                        )}
                        <BallparkStat ballpark={ballpark.data.nickname} name="Filthiness" value={ballpark.filthiness()} details={ballpark.data.filthiness} />
                        <BallparkStat ballpark={ballpark.data.nickname} name="Luxuriousness" value={ballpark.luxuriousness()} details={ballpark.data.luxuriousness} />
                        <BallparkStat ballpark={ballpark.data.nickname} name="Hype" value={ballpark.hype()} details={ballpark.data.hype} />
                        <BallparkStat ballpark={ballpark.data.nickname} name="Birds" value={ballpark.data.birds ?? 0} />
                        <BallparkStat ballpark={ballpark.data.nickname} name="Air Balloons" value={ballpark.data.state?.air_balloons ?? 0} />
                        <BallparkStat ballpark={ballpark.data.nickname} name="Flood Balloons" value={ballpark.data.state?.flood_balloons ?? 0} />
                    </tr>
                )}
            </tbody>
        </table>
    )
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