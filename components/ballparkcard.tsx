import Link from "next/link"
import { CSSProperties } from "react"
import Ballpark, { ballparkAttributeIds } from "../models/ballpark"
import Team from "../models/team"
import Emoji from "./emoji"
import ModificationList from "./modificationlist"
import Tooltip from "./tooltip"

type BallparkCardProps = {
    ballpark: Ballpark,
    team?: Team,
}

export function BallparkCard({ ballpark, team }: BallparkCardProps) {
    const ballparkStats = ballparkAttributeIds.map((id) => {
        const statValue = ballpark.getStat(id) ?? 0
        return {
            id: id,
            name: id[0].toUpperCase() + id.slice(1),
            value: statValue,
            style: getAttributeStyle(ballpark.data.secondaryColor, statValue),
            label: "",
        }
    })
    ballparkStats.push(
        {
            id: "filthiness",
            name: "Filthiness",
            value: ballpark.data.filthiness,
            style: getSpecialStyle(ballpark.data.mainColor, ballpark.data.filthiness),
            label: ballpark.filthiness(),
        },
        {
            id: "luxuriousness",
            name: "Luxuriousness",
            value: ballpark.data.luxuriousness,
            style: getSpecialStyle(ballpark.data.mainColor, ballpark.data.luxuriousness),
            label: ballpark.luxuriousness(),
        },
        {
            id: "hype",
            name: "Hype",
            value: ballpark.data.hype,
            style: getSpecialStyle(ballpark.data.mainColor, ballpark.data.hype),
            label: ballpark.hype(),
        },
    )

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center items-center text-center p-5 border-b-[1px] border-black dark:border-white">
                {team && <Emoji className="h-14 w-14 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team.data.mainColor }} emoji={team.data.emoji} emojiClass="h-8 w-8" />}
                <div>
                    <div className="text-3xl font-bold">{ballpark.data.name}</div>
                    <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{ballpark.data.nickname}</div>
                </div>
            </div>
            {ballpark.data.mods.length > 0 && 
                <div className="flex items-center px-5 py-3 border-b-[1px] border-black dark:border-white text-xl bg-zinc-100 dark:bg-zinc-800/50">
                    <ModificationList 
                        type="ballpark" 
                        permanent={ballpark.data.mods} 
                    />
                </div>
            }
            <div className="flex flex-col overflow-hidden">
                <div className="overflow-auto">
                    <table>
                        <tbody>
                            <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Prefab</td>
                                <td className="px-4 py-2 w-full">{ballpark.prefab()}</td>
                            </tr>
                            <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Home Team</td>
                                <td className="px-4 py-2 w-full italic">
                                    {team 
                                        ? <Link href={{
                                            pathname: "/team/[slugOrId]",
                                            query: {
                                                slugOrId: team.slug()
                                            }
                                        }}>
                                            {team.canonicalNickname()}
                                        </Link>
                                        : <>N/A</>
                                    }
                                </td>
                            </tr>
                            <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Location</td>
                                <td className="px-4 py-2 w-full italic">{team ? team.canonicalLocation() : "Unknown"}</td>
                            </tr>
                            {ballpark.data.renoLog["light_switch_toggle"] !== undefined && <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Light Switch</td>
                                <td className="px-4 py-2 w-full">
                                    {ballpark.data.renoLog["light_switch_toggle"] 
                                        ? <span className="text-yellow-500 dark:text-yellow-400" style={{ textShadow: "0 0 5px white" }}>ON</span>
                                        : <span className="text-neutral-500">OFF</span>
                                    }
                                </td>
                            </tr>}
                            {ballpark.data.birds && <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Birds</td>
                                <td className="px-4 py-2 w-full">{ballpark.data.birds}</td>
                            </tr>}
                            {ballpark.data.state?.air_balloons && <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Air Balloons</td>
                                <td className="px-4 py-2 w-full">{ballpark.data.state.air_balloons}</td>
                            </tr>}
                            {ballpark.data.state?.flood_balloons && <tr className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <td className="px-4 py-2 font-semibold whitespace-nowrap">Flood Balloons</td>
                                <td className="px-4 py-2 w-full">{ballpark.data.state.flood_balloons}</td>
                            </tr>}
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th className="py-2 font-normal font-serif text-xl text-neutral-500 dark:text-neutral-400" colSpan={3}>Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ballparkStats.map((stat) => 
                                <tr key={stat.id} className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                    <td className="pl-4 py-2 font-semibold whitespace-nowrap">{stat.name}</td>
                                    <td className="px-4 py-2 w-full">
                                        <Tooltip content={
                                            <div className="flex flex-col justify-center items-center">
                                                <div className="font-bold">{ballpark.data.nickname}</div>
                                                <div>
                                                    <span className="font-semibold">{stat.name}: </span>
                                                    <span>{stat.value}</span>
                                                </div>
                                            </div>
                                        }>
                                            <div className="relative h-5 rounded-full overflow-hidden bg-zinc-400 dark:bg-zinc-700">
                                                <div className={`h-5 ${stat.value >= 0.49 ? "rounded-r-full" : ""} ${stat.value <= 0.51 ? "rounded-l-full" : ""}`} style={stat.style}></div>
                                                {stat.label && <div className="absolute top-0 left-0 w-full h-full flex justify-center align-center">
                                                    <span className="px-4 text-sm uppercase font-bold overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: ballpark.data.secondaryColor }}>{stat.label}</span>
                                                </div>}
                                            </div>
                                        </Tooltip>
                                    </td>
                                    <td className="pr-4 py-2 text-right">{Math.round(1000 * stat.value) / 1000}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {ballpark.weather().length > 0 && <table className="table-auto w-full mb-4">
                        <thead>
                            <tr>
                                <th className="py-2 font-normal font-serif text-xl text-neutral-500 dark:text-neutral-400" colSpan={2}>Weather</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ballpark.weather().map((weather) => 
                                <tr key={weather.data.name} className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                    <td>
                                        <div className="flex flex-row items-center px-4 py-1">
                                            <Tooltip key={weather.data.name} maxWidth={200} content={
                                                <div>
                                                    <div className="font-semibold"><Emoji emoji={weather.data.emoji} emojiClass="inline h-4 h-4 mr-0.5 align-[-0.1em]" /> {weather.data.name}</div>
                                                    {weather.data.description && <div>{weather.data.description}</div>}
                                                </div>
                                            }>
                                                <span className="px-2 py-1 rounded-md" style={{ backgroundColor: weather.data.background }}><Emoji emoji={weather.data.emoji} emojiClass="inline w-4 h-4 align-[-0.1em]" /></span>
                                            </Tooltip>
                                            <span className="font-bold px-2 py-1">{weather.data.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1 text-right font-semibold">+{weather.frequency}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>}
                </div>
            </div>
        </div>
    )
}

function getAttributeStyle(color: string, value: number): CSSProperties {
    const minimum = 0.02
    let width;
    let offset;
    if(value > 0.5 + minimum / 2) {
        width = (value - 0.5)
        offset = 0.5
    } else if(value < 0.5 - minimum / 2) {
        width = (0.5 - value)
        offset = value
    } else {
        width = minimum
        offset = 0.5 - minimum / 2
    }
    return {
        backgroundColor: color,
        marginLeft: (offset * 100) + "%",
        width: (width * 100) + "%",
    }
}

function getSpecialStyle(color: string, value: number): CSSProperties {
    return {
        backgroundImage: "linear-gradient(45deg, hsla(0, 0%, 100%, .15) 25%, transparent 0, transparent 50%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .15) 75%,transparent 0, transparent)",
        backgroundSize: "1rem 1rem",
        backgroundColor: color,
        width: (value * 100) + "%",
    }
}