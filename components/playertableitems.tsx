import Link from "next/link"
import Item from "../models/item"
import Emoji from "./emoji"
import PlayerItem from "./playeritem"
import Tooltip from "./tooltip"

type PlayerTableItemsProps = {
    items: Item[],
}

export default function PlayerTableItems({ items }: PlayerTableItemsProps) {
    return (
        <>
            {items.length > 0 
                ? <>
                    {items.map((item) => 
                        <Tooltip 
                            key={item.id}
                            content={<PlayerItem item={item} showDetails={true} />}
                        >
                            <span>
                                {item.durability < -1
                                    ? <Emoji emoji={item.emoji} emojiClass="inline min-w-[1em] h-4 m-0.5" />
                                    : <Link href={{
                                        pathname: "/item/[id]",
                                        query: {
                                            id: item.id
                                        }
                                    }}>
                                        <a><Emoji emoji={item.isBroken() ? "0x274C" : item.emoji} emojiClass="inline min-w-[1em] h-4 m-0.5" /></a>
                                    </Link>
                                }
                            </span>
                        </Tooltip>
                    )}
                </>
                : <>-</>
            }
        </>
    )
}