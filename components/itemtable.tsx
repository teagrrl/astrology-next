import Link from "next/link"
import { ColumnAttributes, itemColumns } from "../models/columns"
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

type ItemTableBodyProps = {
    items: Item[],
    armory: Record<string, Player[]>
    positions: Record<string, PlayerPosition>
    isShowSimplified?: boolean,
}

type ItemTableCellProps = {
    item: Item,
    column: ColumnAttributes,
    armory: Record<string, Player[]>,
    positions: Record<string, PlayerPosition>,
    isShowSimplified?: boolean,
}

type ItemStatProps = {
    item: Item,
    column: ColumnAttributes,
}

type AffixAdjustment = {
    id: string,
    name: string,
    adjustment: number,
}

export default function ItemTable({ items, armory, positions, sort, direction, triggerSort, isShowSimplified }: ItemTableProps) {
    if(!items || !armory || !positions) {
        return (
            <h1>Loading...</h1>
        )
    }
    return (
        <table className="table-auto">
            {itemColumns.map((category) => 
                (!isShowSimplified || category.isSimple) && <colgroup key={category.id} span={category.columns.length + (category.id === "general" ? 1 : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
            )}
            <thead>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    {itemColumns.map((category) => 
                        (!isShowSimplified || category.isSimple) && <TableHeader key={`header_${category.id}`} colSpan={category.columns.length + (category.id === "general" ? 1 : 0)}>{category.name}</TableHeader>
                    )}
                </tr>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    {itemColumns.map((category) => 
                        category.columns.map((column) => 
                        (!isShowSimplified || category.isSimple || column.isSimple) && <TableHeader key={`header_${column.id}`} colSpan={column.id === "name" ? 2 : 1} title={column.name} sortId={column.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>{column.shorthand}</TableHeader>
                        )
                    )}
                </tr>
            </thead>
            <ItemTableBody items={items} armory={armory} positions={positions} isShowSimplified={isShowSimplified} />
        </table>
    )
}

function ItemTableBody({ items, armory, positions, isShowSimplified }: ItemTableBodyProps) {
    return (
        <tbody>
            {items.map((item) => 
                <tr key={item.id} className="duration-300 even:bg-zinc-300/20 dark:even:bg-zinc-600/20 hover:bg-zinc-400/20 dark:hover:bg-zinc-400/20">
                    {itemColumns.map((category) => 
                        category.columns.map((column) => 
                            <ItemTableCell key={`${item.id}_${column.id}`} item={item} column={column} armory={armory} positions={positions} isShowSimplified={isShowSimplified} />
                        )
                    )}
                </tr>
            )}
        </tbody>
    )
}

function ItemTableCell({ item, armory, positions, column, isShowSimplified }: ItemTableCellProps) {
    switch(column.id) {
        case "name":
            return (
                <>
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
                </>
            )
        case "owners":
            return (
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
            )
        case "durability":
            return (
                <td className="px-1.5 py-1 text-center">
                    {item.durability < 0 
                        ? <>Unbreakable</>
                        : <>{item.health} / {item.durability}</>
                    }
                </td>
            )
        case "modifications":
            return (
                <td className="px-1.5 py-1 text-center">
                    {item.modifications().length > 0 
                        ? <ModificationList 
                            type="player" 
                            item={item.modifications()} 
                        />
                        : <>-</>
                    }
                </td>
            )
        case "elements":
            return (
                <td className="px-1.5 py-1 text-center">
                    {item.elements.join(", ")}
                </td>
            )
        default:
            return (
                isShowSimplified ? <></> : <ItemStat key={`${item.id}_${column.id}`} item={item} column={column} />
            )
    }
}

function ItemStat({ item, column }: ItemStatProps) {
    const adjustment = item.adjustments[column.id] ?? 0
    const affixAdjustments: AffixAdjustment[] = []
    if(adjustment !== 0) {
        item.affixes.forEach((affix) => {
            const affixAdjustment = affix.adjustments[column.id] ?? 0
            if(affixAdjustment !== 0) {
                affixAdjustments.push({
                    id: affix.name.toLowerCase(),
                    name: affix.name,
                    adjustment: affixAdjustment,
                })
            }
        })
    }
    return (
        <td className={item.getScaleClass(column.id)}>
            {adjustment === 0 
                ? <div className="px-1.5 py-1 text-center">0</div>
                : <Tooltip
                    content={
                        <div className="flex flex-col justify-center items-center">
                            <div>
                                <Emoji emoji={item.emoji} emojiClass="inline w-4 h-4 mr-1.5 align-[-0.1em]" /><span className="font-bold">{item.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold">{column.name}: </span>
                                <span>{adjustment > 0 ? "+" : ""}{adjustment}</span>
                            </div>
                            {affixAdjustments.length > 0 && <div className="flex flex-col justify-center items-center w-full mt-2 pt-2 border-t-[1px] border-white dark:border-zinc-500">
                                {affixAdjustments.map((affix, index) => 
                                    <div key={`${affix.id}_${index}`}>
                                        <span className="font-semibold">{affix.name}: </span>
                                        <span>{affix.adjustment > 0 ? "+" : ""}{affix.adjustment}</span>
                                    </div>
                                )}
                            </div>}
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