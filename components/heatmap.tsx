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
    if(value < 0) value = 0
    if(value > 1) value = 1
    const low = [243, 64, 26]
    const high = [213, 220, 243]
    return [(high[0] - low[0]) * value + low[0], (high[1] - low[1]) * value + low[1], (high[2] - low[2]) * value + low[2]]
}