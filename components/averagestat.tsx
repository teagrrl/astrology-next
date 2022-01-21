import Tippy from "@tippyjs/react";
import { getColorClassForValue, reverseAttributes } from "../models/playerstats";
import Team from "../models/team";

export const averageReverseAttributes = [...reverseAttributes, "peanutAllergy"]

type AverageStatProps = {
    team: Team,
    averages: Record<string, number>[],
    stat?: StatProps,
    id?: string,
    hasColorScale?: boolean,
    isStarRating?: boolean,
    isItemApplied?: boolean,
}

type StatProps = {
    direction?: string,
    id: string,
    name: string,
}

export default function AverageStat({ team, averages, stat, id, hasColorScale, isStarRating, isItemApplied }: AverageStatProps) {
    const stats = averages[isItemApplied? 1 : 0]
    const classNames = ["whitespace-nowrap"]
    let statId: string | undefined
    let statName
    if(stat) {
        statId = stat.id
        statName = stat.name
    } else if(id) {
        statId = id
        statName = id[0].toUpperCase() + id.slice(1)
    }
    if(!statId) {
        throw new Error("AverageStat needs either a stat object or an id")
    }

    let baseStat = averages[0][statId]
    let effectiveStat = stats[statId]
    const hasItemAdjustment = baseStat !== effectiveStat && isItemApplied
    let statDifference = 0
    
    if(typeof baseStat === "number" && typeof effectiveStat === "number") {
        if(hasColorScale) {
            classNames.push(getColorClassForValue(averageReverseAttributes.includes(statId) ? 1 - effectiveStat : statId === "combined" ? effectiveStat / 4 : effectiveStat))
        }
        if(isStarRating) {
            baseStat *= 5
            effectiveStat *= 5
        }
        statDifference = Math.round(1000 * (effectiveStat - baseStat)) / 1000
    }
    if(hasItemAdjustment) {
        classNames.push("italic")
    }

    return (
        <td className={classNames.join(" ")}>
            <Tippy 
                className="px-2 py-1 rounded-md text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100" 
                duration={[200, 0]}
                content={
                    <div className="flex flex-col justify-center items-center">
                        <h3 className="font-bold">{team.canonicalName()}</h3>
                        <div className="flex flex-col justify-center items-center">
                            {statId === "peanutAllergy"
                                ? <div>{Math.round(1000000 * effectiveStat) / 10000}% Allergic</div>
                                : <div>
                                    <span className="font-semibold">Average {statName}: </span>
                                    <span>{isStarRating ? Math.round(1000 * effectiveStat) / 1000 : effectiveStat} {isStarRating ? "Stars" : ""}</span>
                                </div>
                            }
                            {hasItemAdjustment && 
                                <div className="flex flex-col justify-center items-center w-full mt-2 pt-2 border-t-[1px] border-white dark:border-zinc-500">
                                    <div>
                                        <span className="font-semibold">Base: </span>
                                        <span>{baseStat}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Items: </span>
                                        <span className={statDifference > 0 ? "text-sky-300 dark:text-sky-500" : "text-red-400 dark:text-red-600"}>{statDifference > 0 ? "+" : "-"}{Math.abs(statDifference)}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            >
                <div className="px-1.5 py-1 text-center">
                    {statId === "peanutAllergy" 
                        ? (Math.round(10000 * effectiveStat) / 100) + "%"
                        : typeof effectiveStat === "number" ? Math.round(1000 * effectiveStat) / 1000 : effectiveStat
                    }
                </div>
            </Tippy>
        </td>
    )
}