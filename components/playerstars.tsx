import Emoji from "./emoji"
import Tooltip from "./tooltip"

type PlayerStarsProps = {
    title: string,
    baseRating: number,
    adjustedRating?: number,
    evolution?: number,
    isItemApplied?: boolean,
}

export default function PlayerStars({ title, baseRating, adjustedRating, evolution = 0, isItemApplied }: PlayerStarsProps) {
    const totalStars = 5 * ((isItemApplied ? adjustedRating : undefined) ?? baseRating)
    const starDiff = adjustedRating ? adjustedRating - baseRating : 0
    return (
        <Tooltip
            content={<div className="flex flex-col justify-center">
                <span className="text-center font-semibold">{totalStars} {title} Stars</span>
                {isItemApplied && starDiff !== 0 && <div className="flex flex-col justify-center items-center w-full mt-2 pt-2 border-t-[1px] border-white dark:border-zinc-500">
                    <div><span className="font-semibold">Base: </span><span>{5 * baseRating}</span></div>
                    <div><span className="font-semibold">Items: </span><span className={starDiff > 0 ? "text-sky-500" : "text-red-500"}>{starDiff > 0 ? "+" : ""}{5 * starDiff}</span></div>
                </div>}
            </div>}
        >
            <div className="flex flex-wrap justify-center items-center">
                {Array.from(Array(Math.floor(totalStars)).keys()).map((index) => 
                    <Emoji key={index} emoji="0x2B50" className={evolution > index ? "flex justify-center items-center w-5 h-5 border-2 border-amber-500 rounded-full mr-0.5" : "mr-0.5"} emojiClass="inline w-4 h-4 align-[-0.1em]" />
                )}
                {totalStars % 1 && 
                    <Emoji emoji="0x2B50" className="overflow-hidden" style={{ width: totalStars % 1 + "em"}} emojiClass="inline w-4 h-4 max-w-none align-[-0.1em]" />
                }
                <span className="font-semibold ml-2 before:content-['('] after:content-[')']">
                    <span>{Math.round(500 * baseRating) / 100}</span>
                    {isItemApplied && starDiff !== 0 &&
                        <>
                            <span className="mx-1">{starDiff > 0 ? "+" : "-"}</span>
                            <span className={starDiff > 0 ? "text-sky-500" : "text-red-500"}>{Math.abs(Math.round(500 * starDiff) / 100)}</span>
                        </>
                    }
                </span>
            </div>
        </Tooltip>
    )
}