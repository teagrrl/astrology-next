import PlayerStats from "../models/playerstats"
import Tooltip from "./tooltip"

type PlayerVibesProps = {
    stats: PlayerStats,
}

export default function PlayerVibes({ stats }: PlayerVibesProps) {
    const stageWidth = 300
    const stageHeight = 50
    const dayRadius = 2

    const minVibe = stats.get("pressurization", true) as number
    const maxVibe = stats.get("cinnamon", true) as number
    const frequency = 6 + Math.round(10 * (stats.get("buoyancy", true) as number))
    const segmentWidth = (stageWidth - dayRadius * 2) / (frequency - 1)
    const range = 0.5 * (minVibe + maxVibe)
    const phaseForDay = (day: number) => Math.PI * ((2 / frequency) * day + 0.5)
    const vibeForDay = (day: number) => (range * Math.sin(phaseForDay(day))) - (0.5 * minVibe) + (0.5 * maxVibe)
    const vibePoints = Array.from(Array(frequency).keys()).map((day) => [segmentWidth * day + dayRadius, -0.5 * (stageHeight - dayRadius * 2) * Math.sin(phaseForDay(day)) + (0.5 * (stageHeight - dayRadius * 2) + dayRadius)])
    const centerLine = stageHeight * maxVibe / (minVibe + maxVibe)

    const vibeCoords = vibePoints.reduce((coords, point) => coords + " " + point[0] + " " + point[1], "M")

    return (
        <div>
            <svg className="w-full h-auto" viewBox={`0 0 ${stageWidth} ${stageHeight}`} width={stageWidth} height={stageHeight}>
                <line className="stroke-1 stroke-gray-400" x1={0} y1={centerLine} x2={stageWidth} y2={centerLine} />
                <path className="fill-transparent stroke-2 stroke-neutral-900 dark:stroke-neutral-100" d={vibeCoords} />
                {vibePoints.map((point, index) => 
                    <VibeTooltip key={`details${index}`} x={point[0]} y={point[1]} radius={dayRadius} day={index + 1} vibe={vibeForDay(index)} /> 
                )}
            </svg>
        </div>
    )
}

type VibeTooltipProps = {
    x: number,
    y: number,
    radius: number,
    day: number,
    vibe: number,
}

function VibeTooltip({ x, y, radius, day, vibe }: VibeTooltipProps) {
    function getVibeCategory(vibe: number) {
        if(vibe > 0.8) {
            return "Most Excellent"
        } else if(vibe > 0.4) {
            return "Excellent"
        } else if(vibe > 0.1) {
            return "Quality"
        } else if(vibe < -0.8) {
            return "Honestly Terrible"
        } else if(vibe < -0.4) {
            return "Far Less Than Ideal"
        } else if(vibe < -0.1) {
            return "Less Than Ideal"
        } else {
            return "Neutral"
        }
    }

    function getVibeColor(vibe: number) {
        if(vibe > 0.8) {
            return "text-lime-300 dark:text-green-500"
        } else if(vibe > 0.4) {
            return "text-green-300 dark:text-emerald-400"
        } else if(vibe > 0.1) {
            return "text-emerald-400 dark:text-teal-500"
        } else if(vibe < -0.8) {
            return "text-red-400 dark:text-red-700"
        } else if(vibe < -0.4) {
            return "text-orange-400 dark:text-orange-600"
        } else if(vibe < -0.1) {
            return "text-amber-300 dark:text-amber-600"
        } else {
            return "text-neutral-300 dark:text-neutral-400"
        }
    }

    return (
        <Tooltip 
            content={
                <>
                    <span className="font-semibold">Day {day}: </span>
                    <span className={getVibeColor(vibe)}>{getVibeCategory(vibe)} ({Math.round(1000 * vibe) / 1000})</span>
                </>
            }
        >
            <circle className={`cursor-pointer fill-neutral-900 dark:fill-neutral-100 stroke-[4] stroke-transparent hover:stroke-neutral-100/50 transition`} cx={x} cy={y} r={radius} />
        </Tooltip>
    )
}