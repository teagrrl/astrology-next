import Emoji from "./emoji"

type PlayerStarsProps = {
    baseRating: number,
    adjustedRating?: number,
    evolution?: number,
}

export default function PlayerStars({ baseRating, adjustedRating, evolution = 0 }: PlayerStarsProps) {
    const totalStars = 5 * (adjustedRating ?? baseRating)
    const starDiff = adjustedRating ? adjustedRating - baseRating : 0
    return (
        <div className="flex justify-center items-center" title={`${totalStars} Stars`}>
            {Array.from(Array(Math.floor(totalStars)).keys()).map((index) => 
                <Emoji key={index} emoji="0x2B50" className={evolution > index ? "flex justify-center items-center w-5 h-5 border-2 border-amber-500 rounded-full mr-0.5" : "mr-0.5"} emojiClass="inline w-4 h-4 align-[-0.1em]" />
            )}
            {totalStars % 1 && 
                <Emoji emoji="0x2B50" className="overflow-hidden" style={{ width: totalStars % 1 + "em"}} emojiClass="inline w-4 h-4 max-w-none align-[-0.1em]" />
            }
            <span className="font-semibold ml-2 before:content-['('] after:content-[')']">
                <span>{Math.round(500 * baseRating) / 100}</span>
                {starDiff !== 0 &&
                    <>
                        <span className="mx-1">{starDiff > 0 ? "+" : "-"}</span>
                        <span className={starDiff > 0 ? "text-sky-500" : "text-red-500"}>{Math.abs(Math.round(500 * starDiff) / 100)}</span>
                    </>
                }
            </span>
        </div>
    )
}