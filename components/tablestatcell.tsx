import React from "react"
import Tooltip from "@components/tooltip"
import { defaultScaleColors, hexToRGBA, range } from "@models/helpers"

type TableStatCellProps = {
    header?: string,
    values: Record<string, number>,
    statId: string,
    statName: string,
    isRating?: boolean,
    isShowColors?: boolean,
    scaleColors?: string[],
}

export default function TableStatCell({ header, values, statId, statName, isRating, isShowColors, scaleColors }: TableStatCellProps) {
    const customScaleColors = scaleColors ? range(9).map((index) => scaleColors[index] ?? defaultScaleColors[index]) : defaultScaleColors
    const rawValue = values[statId]
    if(rawValue === undefined) {
        return (
            <td className="px-1.5 py-1 text-center">N/A</td>
        )
    }
    let visibleValue = rawValue
    if(isRating) visibleValue *= 5
    return (
        <td className="px-1.5 py-1 text-center" style={{ backgroundColor: isShowColors ? hexToRGBA(customScaleColors[getColorIndexForValue(rawValue)], 0.6) : undefined }}>
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

function getColorIndexForValue(value: number) {
    if(value > 1.45) {
        return 8
    } else if(value > 1.15) {
        return 7
    } else if(value > 0.95) {
        return 6
    } else if(value > 0.85) {
        return 5
    } else if(value > 0.65) {
        return 4
    }  else if(value < 0.15) {
        return 0
    } else if(value < 0.25) {
        return 1
    } else if(value < 0.45) {
        return 2
    } else {
        return 3
    }
}