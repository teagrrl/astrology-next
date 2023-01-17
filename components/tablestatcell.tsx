import React from "react"
import Tooltip from "@components/tooltip"

type TableStatCellProps = {
    header?: string,
    values: Record<string, number>,
    statId: string,
    statName: string,
    isRating?: boolean,
}

export default function TableStatCell({ header, values, statId, statName, isRating }: TableStatCellProps) {
    const rawValue = values[statId]
    let visibleValue = rawValue
    if(isRating) visibleValue *= 5
    return (
        <td className={`px-1.5 py-1 text-center ${getColorClassForValue(rawValue)}`}>
            <Tooltip content={
                <div className="flex flex-col justify-center items-center">
                    {header && <h3 className="font-bold">{header}</h3>}
                    <div className="flex flex-col justify-center items-center">
                        <div>
                            <span className="font-semibold">{statName}: </span><span>{visibleValue} {isRating && "Stars"}</span>
                        </div>
                    </div>
                </div>
            }>
                <span>{Math.round(visibleValue * 1000) / 1000}</span>
            </Tooltip>
        </td>
    )
}

function getColorClassForValue(value: number) {
    if(value > 1.45) {
        return "bg-fuchsia-400/50"
    } else if(value > 1.15) {
        return "bg-violet-300/50"
    } else if(value > 0.95) {
        return "bg-blue-300/60"
    } else if(value > 0.85) {
        return "bg-teal-400/50"
    } else if(value > 0.65) {
        return "bg-green-300/50"
    }  else if(value < 0.15) {
        return "bg-red-500/60"
    } else if(value < 0.25) {
        return "bg-orange-400/60"
    } else if(value < 0.45) {
        return "bg-amber-300/60"
    } else {
        return "bg-lime-300/50"
    }
}