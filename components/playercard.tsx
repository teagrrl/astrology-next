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


type PlayerCardProps = {
    player: Player,
    team?: Team,
    stats: PlayerStats,
}

export function PlayerCard({ player, team, stats }: PlayerCardProps) {
    return (
        <div className="m-2 overflow-auto text-black dark:text-white border-[1px] border-black dark:border-white ">
            <div className="border-b-[1px] border-black dark:border-white p-5">
                <div className="flex flex-row items-center text-2xl">
                    <a className="font-semibold" href={`https://blaseball.com/player/${player.id}`}>{player.canonicalName()}</a>
                    <Link href={{
                        pathname: "[slugOrId]/history",
                        query: {
                            slugOrId: player.slug()
                        }
                    }}>
                        <a title={`See the history of changes for ${player.canonicalName()}`}><Emoji emoji="0x1F4CA" emojiClass="h-6 h-6 ml-2" /></a>
                    </Link>
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
                <PlayerStatRow title="Batting"><PlayerStars baseRating={stats.battingRating(false)} adjustedRating={stats.battingRating(true)} evolution={player.data.evolution} /></PlayerStatRow>
                <PlayerStatRow title="Pitching"><PlayerStars baseRating={stats.pitchingRating(false)} adjustedRating={stats.pitchingRating(true)} evolution={player.data.evolution} /></PlayerStatRow>
                <PlayerStatRow title="Baserunning"><PlayerStars baseRating={stats.baserunningRating(false)} adjustedRating={stats.baserunningRating(true)} evolution={player.data.evolution} /></PlayerStatRow>
                <PlayerStatRow title="Defense"><PlayerStars baseRating={stats.defenseRating(false)} adjustedRating={stats.defenseRating(true)} evolution={player.data.evolution} /></PlayerStatRow>
                <PlayerStatRow title="Combined Rating">
                    <div title={`${5 * stats.combinedRating(true)} Total Stars`}>
                        <span className="font-semibold">{Math.round(500 * stats.combinedRating(false)) / 100}</span>
                        {stats.hasItemAdjustment("combined") && <>
                            <span className="mx-1">{stats.combinedRating(true) - stats.combinedRating(false) > 0 ? "+" : "-"}</span>
                            <span className={`font-semibold ${stats.combinedRating(true) > stats.combinedRating(false) ? "text-sky-500" : "text-red-500"}`}>{Math.abs(Math.round(500 * (stats.combinedRating(true) - stats.combinedRating(false))) / 100)}</span>
                        </>}
                        <Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4 ml-1 align-[-0.1em]" />
                    </div>
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

type PlayerCardStatRowProps = {
    children: ReactNode,
    title: string,
}

function PlayerStatRow({ children, title }: PlayerCardStatRowProps) {
    return (
        <div className="grid grid-cols-5 items-center px-5 py-2 odd:bg-zinc-200 dark:odd:bg-zinc-800">
            <div className="col-span-2 font-semibold">{title}</div>
            <div className="flex flex-row items-center col-span-3">{children}</div>
        </div>
    )
}