import Player, { PlayerPosition } from "../models/player"
import { columns } from "../models/columns"
import Emoji from "./emoji"
import Link from "next/link"
import { Fragment } from "react"
import PlayerStat from "./playerstat"
import ModificationList from "./modificationlist"
import TableHeader from "./tableheader"
import AstrologyLoader from "./loader"
import AverageStat from "./averagestat"
import PlayerTableItems from "./playertableitems"

type PlayerTableProps = {
    header?: string,
    players: Player[],
    positions?: Record<string, PlayerPosition>,
    averages?: Record<string, number>[],
    sort?: string,
    direction?: "asc" | "desc",
    triggerSort?: Function,
    isShowSimplified?: boolean,
    isItemApplied?: boolean,
}

type PlayerPositionProps = {
    id: string,
    positions: Record<string, PlayerPosition> | undefined,
}

export default function PlayerTable({ header, players, positions, averages, sort, direction, triggerSort, isShowSimplified, isItemApplied }: PlayerTableProps) {
    if(!players) {
        return <AstrologyLoader />
    }
    if(!players.length) {
        return <></>
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
                            <TableHeader colSpan={2} sortId="name" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Player Name">Name</TableHeader>
                            <TableHeader sortId="team" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Player Team">Team</TableHeader>
                            <TableHeader sortId="position" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Player Position">Position</TableHeader>
                            <TableHeader sortId="modifications" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Player Modifications">Modifications</TableHeader>
                            <TableHeader sortId="items" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Player Items">Items</TableHeader>
                            {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) => 
                                <TableHeader key={sibrmetric.id} sortId={sibrmetric.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title={sibrmetric.name}>{sibrmetric.shorthand}</TableHeader>
                            )}
                            <TableHeader sortId="combined" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Combined Stars"><Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4" /></TableHeader>
                            {columns.categories.map((category) =>
                                <Fragment key={`subheader_${category.id}`}>
                                    {category.hasRating && <TableHeader sortId={category.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title={`${category.name} Stars`}><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></TableHeader>}
                                    {!isShowSimplified && category.attributes.map((attribute) =>
                                        <TableHeader key={`subheader_${attribute.id}`} sortId={attribute.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title={attribute.name}>{attribute.shorthand}</TableHeader>
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
                                    <Link href={{
                                        pathname: "/player/[slugOrId]",
                                        query: {
                                            slugOrId: player.slug()
                                        }
                                    }}>
                                        <a className="font-bold">{player.canonicalName()}</a>
                                    </Link>
                                </td>
                                <td className="px-1.5 py-1">
                                    <div className="flex flex-row">
                                        <Link href={{
                                            pathname: "/player/[slugOrId]/history",
                                            query: {
                                                slugOrId: player.slug()
                                            }
                                        }}>
                                            <a title={`See the history of changes for ${player.canonicalName()}`}><Emoji emoji="0x1F4CA" emojiClass="min-w-[1em] h-4 m-0.5" /></a>
                                        </Link>
                                        <a href={`https://blaseball.com/player/${player.id}`} title={`Go to official player page for ${player.canonicalName()}`}>
                                            <Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4 m-0.5" />
                                        </a>
                                    </div>
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
                                    <PlayerTableItems items={player.items} />
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
                        {players.length > 1 && averages && <tr className="duration-300 border-t-2 border-black dark:border-zinc-500 hover:bg-zinc-400/20">      
                            <td colSpan={6} className="px-1.5 py-1 font-bold">{header} Average</td>
                            {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) =>
                                <AverageStat key={`average_${sibrmetric.id}`} averages={averages} stat={sibrmetric} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                            )}
                            <AverageStat averages={averages} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                            {columns.categories.map((category) =>
                                <Fragment key={`average_${category.id}`}>
                                    {category.hasRating && <AverageStat averages={averages} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />}
                                    {!isShowSimplified && category.attributes.map((attribute) => 
                                        <AverageStat key={`average_${attribute.id}`} averages={averages} stat={attribute} hasColorScale={attribute.id === "peanutAllergy" || category.id !== "misc"} isItemApplied={isItemApplied} />
                                    )}
                                </Fragment>
                            )}
                        </tr>}
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
                <Link href={{
                    pathname: "/team/[slugOrId]",
                    query: {
                        slugOrId: team.slug()
                    }
                }}>
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