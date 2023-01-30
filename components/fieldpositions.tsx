import React from "react"
import Player, { fieldPositions } from "@models/player2"
import Tooltip from "@components/tooltip"

type FieldPositions = {
    players: Player[],
}

export default function FieldPositions({ players }: FieldPositions) {
    const positions: Record<number, string[]> = {}
    players.forEach((player) => {
        player.positions.forEach((position) => {
            const posValue = 6 * position.x + position.y
            positions[posValue] = positions[posValue] ?? []
            positions[posValue].push((player.name))
        })
    })
    return (
        <div className="flex flex-col">
            <div className="w-[340px] h-[340px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                <div className="grid grid-cols-6 rotate-[225deg] border-t-2 border-l-2 text-xs border-zinc-300">
                    {fieldPositions.map((position, index) =>
                        <div key={`position_${index}`} className={`flex w-[40px] h-[40px] md:w-[50px] md:h-[50px] items-center justify-center text-center border-b-2 border-r-2 border-zinc-300 $`}>
                            <Tooltip content={
                                <div className="flex flex-col items-center">
                                    <span className="font-semibold">{position}</span>
                                    {positions[index] && positions[index].length > 0 && <div className="w-full flex flex-col flex-grow items-center mt-0.5 pt-0.5 border-t-2 border-white dark:border-black">
                                        {positions[index].map((player, index) => <span key={`pos_${index}`}>{player}</span>)}
                                    </div>}
                                </div>
                            }>
                                <div className="flex items-center justify-center -rotate-[225deg] cursor-default min-w-full min-h-[50%]">
                                    {positions[index] && positions[index].length > 0 && <div className="flex flex-col flex-grow gap 0.5 items-center rounded-md border-2 border-black dark:border-white bg-zinc-200 dark:bg-zinc-700">
                                        {positions[index].map((player, index) => <div key={`pos_${index}`} className="w-full px-1 py-0.5 mt-0.5 border-t-2 first:mt-0 first:border-0 whitespace-nowrap">{player}</div>)}
                                    </div>}
                                </div>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}