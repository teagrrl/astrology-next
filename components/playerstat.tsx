import Player from "../models/player"
import PlayerStats from "../models/playerstats";
import Emoji from "./emoji";
import Tooltip from "./tooltip";

type PlayerStatProps = {
    player: Player,
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

export default function PlayerStat({ player, stat, id, hasColorScale, isStarRating, isItemApplied }: PlayerStatProps) {
    const stats = new PlayerStats(player)
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
        throw new Error("PlayerStat needs either a stat object or an id")
    }

    const hasItemAdjustment = stats.hasItemAdjustment(statId) && isItemApplied
    const itemAdjustments = player.items.map((item) => {
        return {
            id: item.id,
            name: item.name,
            adjustment: (statId !== undefined ? item.adjustments[statId] : 0) ?? 0,
        }
    }).filter((item) => item.adjustment !== 0)
    let effectiveStat: any = stats.get(statId, isItemApplied)
    let baseStat = stats.get(statId, false)
    let starDifference = 0
    
    switch(statId) {
        case "blood":
            effectiveStat = player.blood()
            break;
        case "coffee":
            effectiveStat = player.coffee()
            break;
    }
    if(effectiveStat === undefined || effectiveStat === null) {
        effectiveStat = "N/A"
    }
    if(statId === "peanutAllergy" && typeof effectiveStat === "boolean") {
        classNames.push(effectiveStat ? "bg-red-500/50" : "bg-blue-400/60")
        effectiveStat = <Emoji emoji={effectiveStat ? "0x1F922" : "0x1F60B"} emojiClass="inline w-4 h-4" />
    }
    if(typeof baseStat === "number" && typeof effectiveStat === "number") {
        if(hasColorScale) {
            classNames.push(stats.getScaleClass(statId, isItemApplied))
        }
        if(isStarRating) {
            baseStat *= 5
            effectiveStat *= 5
            starDifference = Math.round(1000 * (effectiveStat - baseStat)) / 1000
        }
    }
    if(hasItemAdjustment) {
        classNames.push("italic")
    }
    
    return (
        <td className={classNames.join(" ")}>
            <Tooltip 
                content={
                    <div className="flex flex-col justify-center items-center">
                        <h3 className="font-bold">{player.canonicalName()}</h3>
                        {
                            statId === "peanutAllergy" && baseStat !== undefined && baseStat !== null
                                ? <div className="font-semibold">{baseStat ? "Allergic" : "Not Allergic"}</div>
                                : <div className="flex flex-col justify-center items-center ">
                                    <div>
                                        <span className="font-semibold">{statName}: </span><span>{isStarRating ? Math.round(1000 * effectiveStat) / 1000 : effectiveStat} {isStarRating ? "Stars" : ""}</span>
                                    </div>
                                    {hasItemAdjustment && 
                                        <div className="flex flex-col justify-center items-center w-full mt-2 pt-2 border-t-[1px] border-white dark:border-zinc-500">
                                            {isStarRating 
                                                ? <>
                                                    <div>
                                                        <span className="font-semibold">Base: </span>
                                                        <span>{baseStat}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">Items: </span>
                                                        <span className={starDifference > 0 ? "text-sky-300 dark:text-sky-500" : "text-red-400 dark:text-red-600"}>{starDifference > 0 ? "+" : "-"}{Math.abs(starDifference)}</span>
                                                    </div>
                                                </>
                                                : <>
                                                    <div>
                                                        <span className="font-semibold">Base: </span><span>{baseStat}</span>
                                                    </div>
                                                    {itemAdjustments.map((item) => 
                                                        <div key={item.id}><span className="font-semibold">{item.name}: </span><span className={item.adjustment > 0 ? "text-sky-300 dark:text-sky-500" : "text-red-400 dark:text-red-600"}>{item.adjustment > 0 ? "+" : "-"}{Math.abs(Math.round(1000 * item.adjustment) / 1000)}</span></div>
                                                    )}
                                                </> 
                                            }
                                        </div>
                                    }
                                </div>
                        }
                    </div>
                }
            >
                <div className="px-1.5 py-1 text-center">{typeof effectiveStat === "number" ? Math.round(1000 * effectiveStat) / 1000 : effectiveStat}</div>
            </Tooltip>
        </td>
    )
}