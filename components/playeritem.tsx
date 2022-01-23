import Link from "next/link"
import { columns } from "../models/columns"
import Item from "../models/item"
import Player from "../models/player"
import Team from "../models/team"
import Emoji from "./emoji"
import { getModificationTitleById } from "./modification"
import ModificationList from "./modificationlist"

type ItemOwner = {
    player: Player,
    team?: Team,
}

type PlayerItemProps = {
    item: Item,
    owners?: ItemOwner[],
    showDetails?: boolean,
    showModEmojis?: boolean,
    showStats?: boolean,
    hasLink?: boolean,
}

export default function PlayerItem({ item, owners, showDetails, showModEmojis, showStats, hasLink }: PlayerItemProps) {
    const filteredColumns = columns.categories.map((category) => {
        const attributes = category.attributes.filter((attribute) => Object.keys(item.adjustments).includes(attribute.id))
        return {
            attributes: attributes,
            id: category.id,
            name: category.name,
        }
    }).filter((category) => category.attributes.length > 0)

    return (
        <div className="flex flex-col">
            {showStats && owners && owners.length > 0 && 
                <div className="grid grid-cols-3 items-center mb-4 pb-4 border-b-[1px] border-white dark:border-zinc-400">
                    <div className="text-4xl font-bold">{owners.length > 1 ? "Owners" : "Owner"}</div>
                    <div className="flex flex-col col-span-2">
                        {owners.map((owner) => 
                            <div key={owner.player.id} className="px-4 py-2 even:bg-zinc-200 dark:even:bg-zinc-800">
                                <div className="text-2xl">
                                    <Link href={{
                                        pathname: "/player/[slugOrId]",
                                        query: {
                                            slugOrId: owner.player.slug()
                                        }
                                    }}>
                                        <a className="font-semibold">{owner.player.canonicalName()}</a>
                                    </Link>
                                </div>
                                <div className="flex flex-row flex-wrap items-center mt-1">
                                    <Emoji emoji={owner.team?.data.emoji || "0x2753"} className="h-7 w-7 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: owner.team?.data.mainColor ?? "#aaaaaa" }} emojiClass="w-4 h-4" />
                                    {owner.team
                                        ? <Link href={{
                                            pathname: "/team/[slugOrId]",
                                            query: {
                                                slugOrId: owner.team.slug()
                                            }
                                        }}>
                                            <a className="font-semibold">{owner.team.canonicalName()}</a>
                                        </Link>
                                        : <span className="font-semibold">Null Team</span>
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
            <div className="flex flex-row justify-center">
                <div className="flex flex-col grow justify-center items-center">
                    <Emoji emoji={item.emoji} emojiClass="inline w-12 h-12 mb-2" />
                    <span className="text-center font-semibold">
                        {hasLink 
                            ? <Link href={{
                                pathname: "/item/[id]",
                                query: {
                                    id: item.id
                                }
                            }}>{item.name}</Link>
                            : <span>{item.name}</span>
                        }
                    </span>
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
                </div>
                {showDetails && 
                    <div className="grid grid-cols-2 grow gap-2 ml-2.5 pl-2.5 border-l-[1px] border-white dark:border-zinc-400">
                        <span className="font-semibold">Type</span>
                        <span>{item.type}</span>
                        <span className="font-semibold">Elements</span>
                        <span>{item.elements.length > 0 ? item.elements.join(", ") : "None"}</span>
                        <span className="font-semibold">Mods</span>
                        <span>
                            {item.mods.length > 0 
                                ? showModEmojis 
                                    ? <ModificationList type="player" item={item.mods} />
                                    : item.mods.map((mod) => getModificationTitleById(mod)).join(", ")
                                : "None"
                            }
                        </span>
                    </div>
                }
            </div>
            {showStats && 
                <div className="mt-4 pt-4 border-t-[1px] border-white dark:border-zinc-400">
                    {filteredColumns.map((category) => 
                        category.id !== "misc" && <div key={category.id} className="mb-5 last:mb-0">
                            <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                            {category.attributes.map((attribute) => 
                                <div 
                                    key={attribute.id} 
                                    className="grid grid-cols-2 items-center px-4 py-2 even:bg-zinc-200 dark:even:bg-zinc-800" 
                                    title={`${attribute.name}: ${item.adjustments[attribute.id]}`}
                                >
                                    <span className="text-ellipsis font-semibold overflow-hidden">{attribute.name}</span>
                                    <span className={`text-right ${item.adjustments[attribute.id] > 0 ? "text-sky-500" : "text-red-500"}`}>{item.adjustments[attribute.id] > 0 ? "+" : "-"}{Math.abs(Math.round(1000 * item.adjustments[attribute.id]) / 1000)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}