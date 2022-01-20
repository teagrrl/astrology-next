import Tippy from "@tippyjs/react"
import Link from "next/link"
import { Fragment } from "react"
import { columns } from "../models/columns"
import Item from "../models/item"
import Player, { PlayerPosition } from "../models/player"
import Emoji from "./emoji"
import ModificationList from "./modificationlist"
import TableHeader from "./tableheader"

type ItemTableProps = {
    items: Item[] | undefined,
    armory: Record<string, Player[]> | undefined,
    positions?: Record<string, PlayerPosition> | undefined,
    sort?: string,
    direction?: "asc" | "desc",
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

export default function ItemTable({ items, armory, positions, direction, sort, isShowSimplified }: ItemTableProps) {
    if(!items || !armory || !positions) {
        return (
            <h1>Loading...</h1>
        )
    }
    return (
        <table className="table-auto">
            <colgroup span={6} className="border-r-2 border-black dark:border-white"></colgroup>
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
                    <TableHeader colSpan={2} title="Item Name" sort={sort === "name" ? direction : undefined}>Name</TableHeader>
                    <TableHeader title="Item Owner(s)" sort={sort === "owners" ? direction : undefined}>Owner(s)</TableHeader>
                    <TableHeader title="Item Durability" sort={sort === "durability" ? direction : undefined}>Durability</TableHeader>
                    <TableHeader title="Item Modifications" sort={sort === "modifications" ? direction : undefined}>Modifications</TableHeader>
                    <TableHeader title="Item Elements" sort={sort === "elements" ? direction : undefined}>Elements</TableHeader>
                    {!isShowSimplified && columns.categories.map((category) =>
                        category.id !== "misc" && <Fragment key={`subheader_${category.id}`}>
                            {category.attributes.map((attribute) =>
                                <TableHeader key={`subheader_${attribute.id}`} title={attribute.name} sort={sort === attribute.id ? direction : undefined}>{attribute.shorthand}</TableHeader>
                            )}
                        </Fragment>
                    )}
                </tr>
            </thead>
            <tbody>
                {items.map((item) => 
                    <tr key={item.id} className="duration-300 hover:bg-zinc-400/20">
                        <td>
                            <div className="flex flex-row flex-nowrap items-center px-1.5 py-1">
                                <Emoji emoji={item.emoji} emojiClass="inline min-w-[1em] h-4 mr-1 align-[-0.1em]" />
                                <Link href={`/item/${item.id}`}>
                                    <a className="inline-block max-w-[200px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Tippy 
                                            className="px-2 py-1 rounded-md text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100" 
                                            duration={[200, 0]}
                                            content={item.name}
                                        >
                                            <span>{item.name}</span>
                                        </Tippy>
                                    </a>
                                </Link>
                            </div>
                        </td>
                        <td className="px-1.5 py-1">
                            <Link href={`https://blaseball.com/item/${item.id}`}><a title={`Go to official item page for ${item.name}`}><Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4" /></a></Link>
                        </td>
                        <td className="px-1.5 py-1">
                            <div className="flex flex-col">
                                {armory[item.id] 
                                    ? armory[item.id].map((player) => 
                                        <span key={`${item.id}_${player.id}`} className="whitespace-nowrap">
                                            <Link key={player.id} href={`/player/${player.slug()}`}>
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
                : <Tippy
                    className="px-2 py-1 rounded-md text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100" 
                    duration={[200, 0]}
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
                </Tippy>
            }
        </td>
    )
}

function ucFirst(str: string) {
    return str[0].toUpperCase() + str.slice(1)
}