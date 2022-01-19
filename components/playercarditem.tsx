import Item from "../models/item"
import Emoji from "./emoji"


type PlayerCardItemProps = {
    item: Item | undefined,
    isLocked: boolean,
}

export default function PlayerCardItem({ item, isLocked }: PlayerCardItemProps) {
    return (
        <div className="flex flex-col justify-center items-center rounded-md px-2 py-4 bg-zinc-200 dark:bg-zinc-800">
            {item
                ? <>
                    <Emoji emoji={item.emoji} emojiClass="inline w-12 h-12 mb-2" />
                    <span className="text-center font-semibold">{item.name}</span>
                    <span className="text-center">
                        {item.durability < 0 
                            ? <span className="font-semibold text-amber-500">{item.status()}</span>
                            : item.durability > 5
                                ? <span className="font-semibold text-red-500" title={`Durability: ${item.status()}`}>
                                    {item.status()}
                                    <Emoji emoji={item.isBroken() ? "0x2B55" : "0x1F534"} emojiClass="inline w-4 h-4 ml-1" />
                                </span>
                                : <span title={`Durability: ${item.status()}`}>
                                    {Array.from(Array(item.durability).keys()).map((index) => 
                                        <Emoji key={`${item.id}_durability${index}`} emoji={item.health > index ? "0x1F534" : "0x2B55"} emojiClass="inline w-4 h-4 mx-0.5" />
                                    )}
                                </span>
                        }
                    </span>
                </>
                : <>
                    <Emoji emoji={isLocked ? "0x1F512" : "0x1F513"} emojiClass="inline w-12 h-12 mb-2" />
                    <span className="text-center">{isLocked ? "Locked" : "Empty"} Slot</span>
                </>
            }
        </div>
    )
}