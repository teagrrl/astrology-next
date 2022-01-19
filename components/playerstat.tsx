import Player from "../models/player"
import PlayerStats from "../models/playerstats";
import Emoji from "./emoji";

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
    const classNames = ["px-1.5", "py-1", "text-center", "whitespace-nowrap"]
    let statId
    let statName
    let isReverse = false
    if(stat) {
        statId = stat.id
        statName = stat.name
        isReverse = stat.direction === "desc"
    } else if(id) {
        statId = id
        statName = id[0].toUpperCase() + id.slice(1)
    }
    if(!statId) {
        throw new Error("PlayerStat needs either a stat object or an id")
    }

    const hasItemAdjustment = stats.hasItemAdjustment(statId) && isItemApplied
    let value 
    let title
    value = stats.get(statId, isItemApplied)
    if(statId === "peanutAllergy") {
        title = value ? "Allergic" : "Not Allergic"
        classNames.push(value ? "bg-red-500/50" : "bg-blue-400/60")
        value = <Emoji emoji={value ? "0x1F922" : "0x1F60B"} emojiClass="inline w-4 h-4" />
    }
    if(typeof value === "number") {
        if(hasColorScale) {
            classNames.push(stats.getScaleClass(statId))
        }
        if(isStarRating) {
            value = Math.round(5000 * value) / 1000
        }
    }
    if(!title) {
        title = statName + ": "
        if(hasItemAdjustment && typeof value === "number") {
            let base = stats.get(statId, false) as number
            if(isStarRating) {
                base *= 5
            }
            let difference = value - base
            title += (Math.round(1000 * base) / 1000) + (difference > 0 ? " + " : " - ") + Math.abs(Math.round(1000 * difference) / 1000) + (isStarRating ? " Stars" : "")
            classNames.push("italic")
        } else {
            title += value + (isStarRating ? " Stars" : "")
        }
    }
    if(typeof value === "number") {
        value = Math.round(1000 * value) / 1000
    }
    return (
        <td className={classNames.join(" ")} title={title}>{value}</td>
    )
}