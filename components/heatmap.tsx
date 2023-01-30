import React from "react"
import Tooltip from "@components/tooltip"

type HeatMapProps = {
    header?: string,
    values: number[],
}

export default function HeatMap({ header, values }: HeatMapProps) {
    return (
        <div className="flex flex-col">
            {header && <h4 className="font-semibold text-center">{header}</h4>}
            <div className="w-20 h-20 flex items-center justify-center">
                {values.length > 0 
                    ? <div className="grid grid-cols-6 rotate-[225deg] border-2 border-white dark:border-black">
                        {values.map((value, index) =>
                            <div key={`heatmap_${index}`} className="flex w-2 h-2 items-center justify-center text-center" style={{ backgroundColor: `rgb(${getHeatMapColor(value).join(",")})` }}>
                                <Tooltip content={value.toLocaleString()}><span className="-rotate-[225deg] cursor-default">&nbsp;</span></Tooltip>
                            </div>
                        )}
                    </div>
                    : <div className="flex h-12 w-12 border-2 rotate-45 items-center justify-center text-center">
                        <div className="-rotate-45 text-3xl font-bold">?</div>
                    </div>
                }
            </div>
        </div>
    )
}

function getHeatMapColor(value: number) {
    const low = [255, 64, 52]
    const high = [195, 245, 255]
    return [colorAverage(low[0], high[0], value), colorAverage(low[1], high[1], value), colorAverage(low[2], high[2], value)]
}

function colorAverage(color1: number, color2: number, scale: number) {
    if(scale < 0) scale = 0
    if(scale > 1) scale = 1
    return Math.sqrt(Math.pow(color1, 2) * scale + Math.pow(color2, 2) * (1 - scale))
}