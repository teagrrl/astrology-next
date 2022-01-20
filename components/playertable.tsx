import Player, { PlayerPosition } from "../models/player"
import { columns } from "../models/columns"
import Emoji from "./emoji"
import Link from "next/link"
import { Fragment } from "react"
import PlayerStat from "./playerstat"
import ModificationList from "./modificationlist"
import Tippy from "@tippyjs/react"
import PlayerItem from "./playeritem"
import TableHeader from "./tableheader"

type PlayerTableProps = {
    header?: string,
    players: Player[] | undefined,
    positions: Record<string, PlayerPosition> | undefined,
    sort?: string,
    direction?: "asc" | "desc",
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerPositionProps = {
    id: string,
    positions: Record<string, PlayerPosition> | undefined,
}

export default function PlayerTable({ header, players, positions, direction, sort, isShowSimplified, isItemApplied }: PlayerTableProps) {
    if(!players || !players.length) {
        return (
            <h1>Loading...</h1>
        )
    }
    return (
        <>
            {!!header && <h1 className="my-2 text-center text-2xl font-bold">{header}</h1>}
            <div className="overflow-auto">
                <table className="table-auto">
                    <colgroup span={(isShowSimplified ? 0 : columns.sibrmetrics.length) + 7} className="border-r-2 border-black dark:border-white"></colgroup>
                    {columns.categories.map((category) => 
                        isShowSimplified 
                            ? category.hasRating && <colgroup key={`colgroup_${category.id}`}></colgroup>
                            : <colgroup key={`colgroup_${category.id}`} span={category.attributes.length + (category.hasRating ? 1 : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
                    )}
                    <thead>
                        <tr className="border-b-[1px] border-black dark:border-zinc-500">
                            <TableHeader colSpan={(isShowSimplified ? 0 : columns.sibrmetrics.length) + 7}>General</TableHeader>
                            {columns.categories.map((category) =>
                                isShowSimplified 
                                    ? category.hasRating && <TableHeader key={`header_${category.id}`}>{category.name}</TableHeader>
                                    : <TableHeader key={`header_${category.id}`} colSpan={category.attributes.length + (category.hasRating ? 1 : 0)}>{category.name}</TableHeader>
                            )}
                        </tr>
                        <tr className="border-b-[1px] border-black dark:border-zinc-500">
                            <TableHeader colSpan={2} title="Player Name">Name</TableHeader>
                            <TableHeader title="Player Team">Team</TableHeader>
                            <TableHeader title="Player Position">Position</TableHeader>
                            <TableHeader title="Player Modifications">Modifications</TableHeader>
                            <TableHeader title="Player Items">Items</TableHeader>
                            {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) => 
                                <TableHeader key={sibrmetric.id} title={sibrmetric.name}>{sibrmetric.shorthand}</TableHeader>
                            )}
                            <TableHeader title="Combined Stars"><Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4" /></TableHeader>
                            {columns.categories.map((category) =>
                                <Fragment key={`subheader_${category.id}`}>
                                    {category.hasRating && <TableHeader title={`${category.name} Stars`}><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></TableHeader>}
                                    {!isShowSimplified && category.attributes.map((attribute) =>
                                        <TableHeader key={`subheader_${attribute.id}`} title={attribute.name}>{attribute.shorthand}</TableHeader>
                                    )}
                                </Fragment>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => 
                            <tr key={player.id} className="duration-300 hover:bg-zinc-400/20">
                                <td className="px-1.5 py-1 whitespace-nowrap">
                                    {player.data.deceased && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                                    <Link href={`/player/${player.slug()}`}><a className="font-bold">{player.canonicalName()}</a></Link>
                                </td>
                                <td className="px-1.5 py-1">
                                    <Link href={`https://blaseball.com/player/${player.id}`}><a title={`Go to official player page for ${player.canonicalName()}`}><Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4" /></a></Link>
                                </td>
                                <td className="px-1.5 py-1 whitespace-nowrap"><PlayerTableTeam id={player.id} positions={positions} /></td>
                                <td className="px-1.5 py-1 text-center whitespace-nowrap"><PlayerTablePosition id={player.id} positions={positions} /></td>
                                <td className="px-1.5 py-1 text-center">
                                    {player.modifications().length > 0 
                                        ? <ModificationList 
                                            type="player" 
                                            permanent={player.data.permAttr} 
                                            season={player.data.seasAttr} 
                                            week={player.data.weekAttr} 
                                            game={player.data.gameAttr} 
                                            item={player.data.itemAttr} 
                                        />
                                        : <>-</>
                                    }
                                </td>
                                <td className="px-1.5 py-1 text-center whitespace-nowrap">
                                    {player.items.length > 0 
                                        ? <>
                                            {player.items.map((item) => 
                                                <Tippy 
                                                    key={item.id}
                                                    className="p-2 rounded-md text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100"
                                                    duration={[200, 0]}
                                                    content={<PlayerItem item={item} showDetails={true} />}
                                                >
                                                    <span>
                                                        <Link href={`/item/${item.id}`}>
                                                            <a><Emoji emoji={item.isBroken() ? "0x274C" : item.emoji} emojiClass="inline min-w-[1em] h-4 m-0.5" /></a>
                                                        </Link>
                                                    </span>
                                                </Tippy>
                                            )}
                                        </>
                                        : <>-</>
                                    }
                                </td>
                                {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) =>
                                    <PlayerStat key={`${player.id}_${sibrmetric.id}`} player={player} stat={sibrmetric} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                                )}
                                <PlayerStat player={player} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                                {columns.categories.map((category) =>
                                    <Fragment key={`${player.id}_${category.id}`}>
                                        {category.hasRating && <PlayerStat player={player} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />}
                                        {!isShowSimplified && category.attributes.map((attribute) => 
                                            <PlayerStat key={`${player.id}_${attribute.id}`} player={player} stat={attribute} hasColorScale={category.id !== "misc"} isItemApplied={isItemApplied} />
                                        )}
                                    </Fragment>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

function PlayerTableTeam({ id, positions }: PlayerPositionProps) {
    if(positions) {
        const team = positions[id].team
        if(team) {
            return (
                <Link href={`/team/${team.slug()}`}>
                    <a><Emoji emoji={team.data.emoji} emojiClass="inline min-w-[1em] h-4 mr-1" />
                    {team.canonicalNickname()}</a>
                </Link>
            )
        }
    }
    return <div className="text-center">-</div>
}

function PlayerTablePosition({ id, positions }: PlayerPositionProps) {
    if(positions) {
        const position = positions[id].position
        if(position) {
            return <>{position[0].toUpperCase() + position.slice(1)}</>
        }
    }
    return <>-</>
}