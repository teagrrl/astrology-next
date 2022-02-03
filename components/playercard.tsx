import Link from "next/link"
import { ReactNode } from "react"
import Player from "../models/player"
import PlayerStats from "../models/playerstats"
import Team from "../models/team"
import Emoji from "./emoji"
import ModificationList from "./modificationlist"
import PlayerItem from "./playeritem"
import PlayerStars from "./playerstars"
import PlayerVibes from "./playervibes"
import Tooltip from "./tooltip"

type PlayerCardProps = {
    player: Player,
    team?: Team,
    stats: PlayerStats,
    isItemApplied?: boolean,
}

type PlayerCardStatRowProps = {
    children: ReactNode,
    title: string,
}

export function PlayerCard({ player, team, stats, isItemApplied }: PlayerCardProps) {
    return (
        <div className="m-2 text-black dark:text-white border-[1px] border-black dark:border-white md:w-1/2 md:overflow-auto">
            <div className="border-b-[1px] border-black dark:border-white p-5">
                <div className="flex flex-row items-center text-2xl">
                    <span className="font-semibold">{player.canonicalName()}</span>
                    <Link href={{
                        pathname: "[slugOrId]/history",
                        query: {
                            slugOrId: player.slug()
                        }
                    }}>
                        <a className="ml-1" title={`See the history of changes for ${player.canonicalName()}`}><Emoji emoji="0x1F4CA" emojiClass="w-6 h-6" /></a>
                    </Link>
                    <a className="ml-1" href={`https://blaseball.com/player/${player.id}`} title={`Go to official player page for ${player.canonicalName()}`}>
                        <Emoji emoji="0x1F517" emojiClass="w-6 h-6" />
                    </a>
                </div>
                <div className="flex flex-row flex-wrap items-center mt-1">
                    <Emoji emoji={team?.data.emoji ?? "0x2753"} className="h-7 w-7 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team?.data.mainColor ?? "#aaaaaa" }} emojiClass="w-4 h-4" />
                    {team
                        ? <Link href={{
                            pathname: "/team/[slugOrId]",
                            query: {
                                slugOrId: team.slug()
                            }
                        }}>
                            <a className="font-semibold">{team.canonicalName()}</a>
                        </Link>
                        : <span className="font-semibold">Null Team</span>
                    }
                </div>
            </div>
            {player.modifications().length > 0 && 
                <div className="flex items-center px-5 py-3 border-b-[1px] border-black dark:border-white text-xl bg-zinc-100 dark:bg-zinc-800/50">
                    <ModificationList 
                        type="player" 
                        permanent={player.data.permAttr} 
                        season={player.data.seasAttr} 
                        week={player.data.weekAttr} 
                        game={player.data.gameAttr} 
                        item={player.data.itemAttr} 
                    />
                </div>
            }
            {player.data.deceased && 
                <div className="flex items-center px-5 py-3 border-b-[1px] border-black dark:border-white text-xl font-semibold bg-zinc-100 dark:bg-zinc-800/50">
                    <Emoji emoji="0x1F480" emojiClass="w-5 h-5 mr-2" />
                    <span>Deceased</span>
                </div>
            }
            <div>
                <PlayerStatRow title="Vibes"><PlayerVibes stats={stats} /></PlayerStatRow>
                <PlayerStatRow title="Batting"><PlayerStars title="Batting" baseRating={stats.battingRating(false)} adjustedRating={stats.battingRating(true)} evolution={player.data.evolution} isItemApplied={isItemApplied} /></PlayerStatRow>
                <PlayerStatRow title="Pitching"><PlayerStars title="Pitching" baseRating={stats.pitchingRating(false)} adjustedRating={stats.pitchingRating(true)} evolution={player.data.evolution} isItemApplied={isItemApplied} /></PlayerStatRow>
                <PlayerStatRow title="Baserunning"><PlayerStars title="Baserunning" baseRating={stats.baserunningRating(false)} adjustedRating={stats.baserunningRating(true)} evolution={player.data.evolution} isItemApplied={isItemApplied} /></PlayerStatRow>
                <PlayerStatRow title="Defense"><PlayerStars title="Defense" baseRating={stats.defenseRating(false)} adjustedRating={stats.defenseRating(true)} evolution={player.data.evolution} isItemApplied={isItemApplied} /></PlayerStatRow>
                <PlayerStatRow title="Combined Rating">
                    <Tooltip
                        content={<div className="flex flex-col justify-center">
                            <span className="text-center font-semibold">{5 * stats.combinedRating(true)} Combined Stars</span>
                            {isItemApplied && stats.hasItemAdjustment("combined") && <div className="flex flex-col justify-center items-center w-full mt-2 pt-2 border-t-[1px] border-white dark:border-zinc-500">
                                <div><span className="font-semibold">Base: </span><span>{5 * stats.combinedRating(false)}</span></div>
                                <div><span className="font-semibold">Items: </span><span className={stats.combinedRating(true) > stats.combinedRating(false) ? "text-sky-500" : "text-red-500"}>{stats.combinedRating(true) > stats.combinedRating(false) ? "+" : ""}{5 * (stats.combinedRating(true) - stats.combinedRating(false))}</span></div>
                            </div>}
                        </div>}
                    >
                        <div>
                            <span className="font-semibold">{Math.round(500 * stats.combinedRating(false)) / 100}</span>
                            {isItemApplied && stats.hasItemAdjustment("combined") && <>
                                <span className="mx-1">{stats.combinedRating(true) - stats.combinedRating(false) > 0 ? "+" : "-"}</span>
                                <span className={`font-semibold ${stats.combinedRating(true) > stats.combinedRating(false) ? "text-sky-500" : "text-red-500"}`}>{Math.abs(Math.round(500 * (stats.combinedRating(true) - stats.combinedRating(false))) / 100)}</span>
                            </>}
                            <Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4 ml-1 align-[-0.1em]" />
                        </div>
                    </Tooltip>
                </PlayerStatRow>
                <div className="grid grid-cols-2 gap-5 px-5">
                    {Array.from(Array(4).keys()).map((index) => 
                        <div key={`${player.id}_item${index}`} className="flex flex-col justify-center items-center rounded-md px-2 py-4 bg-zinc-200 dark:bg-zinc-800">
                            {player.items[index]
                                ? <PlayerItem item={player.items[index]} hasLink={true} />
                                : <>
                                    <Emoji emoji={index > player.data.evolution ? "0x1F512" : "0x1F513"} emojiClass="inline w-12 h-12 mb-2" />
                                    <span className="text-center">{index > player.data.evolution ? "Locked" : "Empty"} Slot</span>
                                </>
                            }
                        </div>
                    )}
                </div>
                <PlayerStatRow title="Evolution">
                    <span className={player.data.evolution > 0 ? "font-semibold text-amber-500" : ""}>Base {player.data.evolution > 0 ? player.data.evolution : ""}</span>
                </PlayerStatRow>
                <PlayerStatRow title="Peanut Allergy">{player.data.peanutAllergy ? "Allergic" : "Not Allergic"}</PlayerStatRow>
                <PlayerStatRow title="Pregame Ritual">{player.data.ritual}</PlayerStatRow>
                <PlayerStatRow title="Coffee Style">{player.coffee()}</PlayerStatRow>
                <PlayerStatRow title="Blood Type">{player.blood()}</PlayerStatRow>
                <PlayerStatRow title="Fate">{player.data.fate}</PlayerStatRow>
                <PlayerStatRow title="Total Fingers">{player.data.totalFingers}</PlayerStatRow>
                <PlayerStatRow title="Soulscream"><span className="text-red-500 font-semibold italic break-all">{player.soulscream()}</span></PlayerStatRow>
            </div>
        </div>
    )
}

function PlayerStatRow({ children, title }: PlayerCardStatRowProps) {
    return (
        <div className="grid grid-cols-5 items-center px-5 py-2 odd:bg-zinc-200 dark:odd:bg-zinc-800">
            <div className="col-span-2 font-semibold">{title}</div>
            <div className="flex flex-row items-center col-span-3">{children}</div>
        </div>
    )
}