import Link from "next/link"
import { Fragment } from "react"
import { columns } from "../models/columns"
import Item from "../models/item"
import Player, { PlayerPosition } from "../models/player"
import Emoji from "./emoji"
import ModificationList from "./modificationlist"
import TableHeader from "./tableheader"
import Tooltip from "./tooltip"

type ItemTableProps = {
    items?: Item[],
    armory?: Record<string, Player[]>,
    positions?: Record<string, PlayerPosition>,
    sort?: string,
    direction?: "asc" | "desc",
    triggerSort?: Function,
    isShowSimplified?: boolean,
}

type ColumnAttribute = {
    id: string,
    name: string,
}

type ItemStatProps = {
    item: Item,
    attribute: ColumnAttribute,
}

export default function ItemTable({ items, armory, positions, sort, direction, triggerSort, isShowSimplified }: ItemTableProps) {
    if(!items || !armory || !positions) {
        return (
            <h1>Loading...</h1>
        )
    }
    return (
        <table className="table-auto">
            <colgroup span={6} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
            {!isShowSimplified && columns.categories.map((category) => 
                category.id !== "misc" && <colgroup key={`colgroup_${category.id}`} span={category.attributes.length} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
            )}
            <thead>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    <TableHeader colSpan={6}>General</TableHeader>
                    {!isShowSimplified && columns.categories.map((category) =>
                        category.id !== "misc" && 
                        <TableHeader key={`header_${category.id}`} colSpan={category.attributes.length}>{category.name}</TableHeader>
                    )}
                </tr>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    <TableHeader colSpan={2} title="Item Name" sortId="name" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Name</TableHeader>
                    <TableHeader title="Item Owners" sortId="owners" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Owners</TableHeader>
                    <TableHeader title="Item Durability" sortId="durability" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Durability</TableHeader>
                    <TableHeader title="Item Modifications" sortId="modifications" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Modifications</TableHeader>
                    <TableHeader title="Item Elements" sortId="elements" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>Elements</TableHeader>
                    {!isShowSimplified && columns.categories.map((category) =>
                        category.id !== "misc" && <Fragment key={`subheader_${category.id}`}>
                            {category.attributes.map((attribute) =>
                                <TableHeader key={`subheader_${attribute.id}`} title={attribute.name} sortId={attribute.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>{attribute.shorthand}</TableHeader>
                            )}
                        </Fragment>
                    )}
                </tr>
            </thead>
            <tbody>
                {items.map((item) => 
                    <tr key={item.id} className="duration-300 even:bg-zinc-300/20 dark:even:bg-zinc-600/20 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                        <td>
                            <div className="flex flex-row flex-nowrap items-center px-1.5 py-1">
                                <Emoji emoji={item.emoji} emojiClass="inline min-w-[1em] h-4 mr-1 align-[-0.1em]" />
                                <Link href={{
                                    pathname: "/item/[id]",
                                    query: {
                                        id: item.id
                                    }
                                }}>
                                    <a className="inline-block max-w-[200px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Tooltip content={item.name}><span>{item.name}</span></Tooltip>
                                    </a>
                                </Link>
                            </div>
                        </td>
                        <td className="px-1.5 py-1">
                            <a href={`https://blaseball.com/item/${item.id}`} title={`Go to official item page for ${item.name}`}><Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4" /></a>
                        </td>
                        <td className="px-1.5 py-1">
                            <div className="flex flex-col">
                                {armory[item.id] 
                                    ? armory[item.id].map((player) => 
                                        <span key={`${item.id}_${player.id}`} className="whitespace-nowrap">
                                            <Link key={player.id} href={{
                                                pathname: "/player/[slugOrId]",
                                                query: {
                                                    slugOrId: player.slug()
                                                }
                                            }}>
                                                <a className="font-semibold">
                                                    <Emoji emoji={positions[player.id].team?.data.emoji ?? "0x2753"} emojiClass="inline min-w-[1em] h-4 mr-1 align-[-0.1em]" /> 
                                                    {player.canonicalName()}
                                                </a>
                                            </Link>
                                            {positions[player.id].position && <span> ({ucFirst(positions[player.id].position as string)})</span>}
                                        </span>
                                    ) 
                                    : <span className="block text-center">-</span>
                                }
                            </div>
                        </td>
                        <td className="px-1.5 py-1 text-center">
                            {item.durability < 0 
                                ? <>Unbreakable</>
                                : <>{item.health} / {item.durability}</>
                            }
                        </td>
                        <td className="px-1.5 py-1 text-center">
                            {item.mods.length > 0 
                                ? <ModificationList 
                                    type="player" 
                                    item={item.mods} 
                                />
                                : <>-</>
                            }
                        </td>
                        <td className="px-1.5 py-1 text-center">
                            {item.elements.join(", ")}
                        </td>
                        {!isShowSimplified && columns.categories.map((category) =>
                            <Fragment key={`${item.id}_${category.id}`}>
                                {category.attributes.map((attribute) => 
                                    category.id !== "misc" && <ItemStat key={`${item.id}_${attribute.id}`} item={item} attribute={attribute} />
                                )}
                            </Fragment>
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    )
}

function ItemStat({ item, attribute }: ItemStatProps) {
    const adjustment = item.adjustments[attribute.id] ?? 0
    return (
        <td className={item.getScaleClass(attribute.id)}>
            {adjustment === 0 
                ? <div className="px-1.5 py-1 text-center">0</div>
                : <Tooltip
                    content={
                        <div className="flex flex-col justify-center items-center">
                            <div>
                                <Emoji emoji={item.emoji} emojiClass="inline w-4 h-4 mr-1.5 align-[-0.1em]" /><span className="font-bold">{item.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold">{attribute.name}: </span>
                                <span>{adjustment > 0 ? "+" : "-"}{Math.abs(adjustment)}</span>
                            </div>
                        </div>
                    }
                >
                    <div className="px-1.5 py-1 text-center">{Math.round(1000 * adjustment) / 1000}</div>
                </Tooltip>
            }
        </td>
    )
}

function ucFirst(str: string) {
    return str[0].toUpperCase() + str.slice(1)
}