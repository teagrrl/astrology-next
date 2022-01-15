import Player, { PlayerPosition } from "../models/player"
import { columns } from "../models/columns"
import Emoji from "./emoji"
import Link from "next/link"
import { Fragment } from "react"
import PlayerStat from "./playerstat"
import Modification from "./modification"

type PlayerTableProps = {
    header: string,
    players: Player[] | undefined,
    positions: Record<string, PlayerPosition> | undefined,
    canSeeFk?: boolean,
    isItemApplied?: boolean,
}

type PlayerPositionProps = {
    id: string,
    positions: Record<string, PlayerPosition> | undefined,
}

export default function PlayerTable({ header, players, positions, canSeeFk, isItemApplied }: PlayerTableProps) {
    if(!players || !players.length) {
        return (
            <h1>Loading...</h1>
        )
    }
    return (
        <>
            <h1 className="my-2 text-center text-2xl font-bold">{header}</h1>
            <div className="overflow-auto">
                <table className="table-auto">
                    <colgroup span={(canSeeFk ? columns.sibrmetrics.length : 0) + 7} className="border-r-2 border-black dark:border-white"></colgroup>
                    {columns.categories.map((category) => 
                        canSeeFk 
                            ? <colgroup key={`colgroup_${category.id}`} span={category.attributes.length + (category.hasRating ? 1 : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
                            : category.hasRating && <colgroup key={`colgroup_${category.id}`}></colgroup>
                    )}
                    <thead>
                        <tr className="border-b-[1px] border-black dark:border-gray-500">
                            <th colSpan={(canSeeFk ? columns.sibrmetrics.length : 0) + 7} className="duration-300 hover:bg-gray-400/20">General</th>
                            {columns.categories.map((category) =>
                                canSeeFk 
                                    ? <th key={`header_${category.id}`} colSpan={category.attributes.length + (category.hasRating ? 1 : 0)} className="hover:bg-gray-400/20">{category.name}</th>
                                    : category.hasRating && <th key={`header_${category.id}`} className="duration-300 hover:bg-gray-400/20">{category.name}</th>
                            )}
                        </tr>
                        <tr className="border-b-[1px] border-black dark:border-gray-500">
                            <th colSpan={2} className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title="Player Name">Name</th>
                            <th className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title="Player Team">Team</th>
                            <th className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title="Player Position">Position</th>
                            <th className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title="Player Modifications">Modifications</th>
                            <th className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title="Player Items" >Items</th>
                            {canSeeFk && columns.sibrmetrics.map((sibrmetric) => 
                                <th key={sibrmetric.id} className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title={sibrmetric.name}>{sibrmetric.shorthand}</th>
                            )}
                            <th className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title="Combined Stars"><Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4" /></th>
                            {columns.categories.map((category) =>
                                <Fragment key={`subheader_${category.id}`}>
                                    {category.hasRating && <th className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title={`${category.name} Stars`}><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></th>}
                                    {canSeeFk && category.attributes.map((attribute) =>
                                        <th key={`subheader_${attribute.id}`} className="px-1.5 py-1 text-center duration-300 hover:bg-gray-400/20" title={attribute.name}>{attribute.shorthand}</th>
                                    )}
                                </Fragment>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => 
                            <tr key={player.id} className="duration-300 hover:bg-gray-400/20">
                                <td className="px-1.5 py-1 whitespace-nowrap">
                                    {player.data.deceased && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                                    <Link href={`/player/${player.slug()}`}><a className="font-bold">{player.canonicalName()}</a></Link>
                                </td>
                                <td className="px-1.5 py-1">
                                    <Link href={`https://blaseball.com/player/${player.id}`}><a title={`Go to official player page for ${player.canonicalName()}`}><Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4" /></a></Link>
                                </td>
                                <td className="px-1.5 py-1 whitespace-nowrap"><PlayerTableTeam id={player.id} positions={positions} /></td>
                                <td className="px-1.5 py-1 text-center whitespace-nowrap"><PlayerTablePosition id={player.id} positions={positions} /></td>
                                <td className="px-1.5 py-1 text-center whitespace-nowrap">
                                    {player.modifications().length > 0 
                                        ? <>
                                            {player.data.permAttr?.map((id) => 
                                                <Modification key={`permanent_${id}`} id={id} duration="permanent" type="player" />
                                            )}
                                            {player.data.seasAttr?.map((id) => 
                                                <Modification key={`season_${id}`} id={id} duration="season" type="player" />
                                            )}
                                            {player.data.weekAttr?.map((id) => 
                                                <Modification key={`week_${id}`} id={id} duration="week" type="player" />
                                            )}
                                            {player.data.gameAttr?.map((id) => 
                                                <Modification key={`game_${id}`} id={id} duration="game" type="player" />
                                            )}
                                            {player.data.itemAttr?.map((id) => 
                                                <Modification key={`item_${id}`} id={id} duration="item" type="player" />
                                            )}
                                        </>
                                        : <>-</>
                                    }
                                </td>
                                <td className="px-1.5 py-1 text-center whitespace-nowrap">
                                    {player.items.length > 0 
                                        ? <>
                                            {player.items.map((item) => 
                                                <span key={item.id} title={`${item.name} (${item.status()})`}>
                                                    <Emoji emoji={item.isBroken() ? "0x274C" : item.emoji} emojiClass="inline min-w-[1em] h-4 m-0.5" />
                                                </span>
                                            )}
                                        </>
                                        : <>-</>
                                    }
                                </td>
                                {canSeeFk && columns.sibrmetrics.map((sibrmetric) =>
                                    <PlayerStat key={`${player.id}_${sibrmetric.id}`} player={player} stat={sibrmetric} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                                )}
                                <PlayerStat player={player} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                                {columns.categories.map((category) =>
                                    <Fragment key={`${player.id}_${category.id}`}>
                                        {category.hasRating && <PlayerStat player={player} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />}
                                        {canSeeFk && category.attributes.map((attribute) => 
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