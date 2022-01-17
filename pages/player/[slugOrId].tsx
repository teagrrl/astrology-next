import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode } from 'react'
import Emoji from '../../components/emoji'
import Layout from '../../components/layout'
import Modification from '../../components/modification'
import { columns } from '../../models/columns'
import Item from '../../models/item'
import PlayerStats from '../../models/playerstats'
import { useChroniclerToFetchLeagueData } from '../../useChronicler'
import { PageProps } from '../_app'

type PlayerPageProps = PageProps & {
	
}

export default function PlayerPage({ isItemApplied, isShowSimplified }: PlayerPageProps) {
    const router = useRouter()
    const { slugOrId } = router.query
	const data = useChroniclerToFetchLeagueData()

	const player = data?.players.find((player) => player.id === slugOrId || player.slug() === (slugOrId as string).toLowerCase())
	if(!player) {
		return (
			<h1>Loading...</h1>
		)
	}
    const team = data?.positions[player.id].team
    const stats = new PlayerStats(player)
	
	return (
        <section className="grid grid-cols-2 overflow-hidden">
            <div className="m-2 overflow-auto text-black dark:text-white border-[1px] border-black dark:border-white ">
                <div className="border-b-[1px] border-black dark:border-white p-5">
                    <div className="text-2xl">
                        <a className="font-semibold" href={`https://blaseball.com/player/${player.id}`}>{player.canonicalName()}</a>
                    </div>
                    <div className="flex flex-row flex-wrap items-center mt-1">
                        <Emoji emoji={team?.data.emoji || "0x2753"} className="h-7 w-7 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team?.data.secondaryColor }} emojiClass="w-4 h-4" />
                        {team
                            ? <Link href={`/team/${team.slug()}`}><a className="font-semibold">{team.canonicalName()}</a></Link>
                            : <span className="font-semibold">Null Team</span>
                        }
                    </div>
                </div>
                {player.modifications().length > 0 && 
                    <div className="flex items-center px-5 py-3 border-b-[1px] border-black dark:border-white bg-zinc-100 dark:bg-zinc-800/50">
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
                    </div>
                }
                {player.data.deceased && 
                    <div className="flex items-center px-5 py-3 border-b-[1px] border-black dark:border-white text-xl font-semibold bg-zinc-100 dark:bg-zinc-800/50">
                        <Emoji emoji="0x1F480" emojiClass="w-5 h-5 mr-2" />
                        <span>Deceased</span>
                    </div>
                }
                <div>
                    <PlayerStatRow title="Vibes">
                        <div className="flex flex-col">
                            <span>{stats.get("cinnamon", true)}</span>
                            <span>{stats.get("pressurization", true)}</span>
                            <span>{stats.get("buoyancy", true)}</span>
                        </div>
                    </PlayerStatRow>
                    <PlayerStatRow title="Batting"><PlayerCardStars baseRating={stats.battingRating(false)} adjustedRating={stats.battingRating(true)} /></PlayerStatRow>
                    <PlayerStatRow title="Pitching"><PlayerCardStars baseRating={stats.pitchingRating(false)} adjustedRating={stats.pitchingRating(true)} /></PlayerStatRow>
                    <PlayerStatRow title="Baserunning"><PlayerCardStars baseRating={stats.baserunningRating(false)} adjustedRating={stats.baserunningRating(true)} /></PlayerStatRow>
                    <PlayerStatRow title="Defense"><PlayerCardStars baseRating={stats.defenseRating(false)} adjustedRating={stats.defenseRating(true)} /></PlayerStatRow>
                    <PlayerStatRow title="Combined Rating">
                        <div title={`${5 * stats.combinedRating(true)} Total Stars`}>
                            <span className="font-semibold">{Math.round(500 * stats.combinedRating(false)) / 100}</span>
                            <span className="mx-1">{stats.combinedRating(true) - stats.combinedRating(false) > 0 ? "+" : "-"}</span>
                            <span className={`font-semibold ${stats.combinedRating(true) > stats.combinedRating(false) ? "text-sky-500" : "text-red-500"}`}>{Math.abs(Math.round(500 * (stats.combinedRating(true) - stats.combinedRating(false))) / 100)}</span>
                            <Emoji emoji="0x2B50" emojiClass="inline w-4 h-4 ml-1 align-[-0.1em]" />
                        </div>
                    </PlayerStatRow>
                    <div className="grid grid-cols-2 gap-5 px-5">
                        {Array.from(Array(4).keys()).map((index) => 
                            <PlayerCardItem key={`${player.id}_item${index}`} item={player.items[index]} isLocked={index > player.data.evolution} />
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
                    <PlayerStatRow title="Soulscream"><span className="text-red-600 font-semibold italic break-all">{player.soulscream()}</span></PlayerStatRow>
                </div>
            </div>
            <div className="flex flex-col grow p-2 overflow-auto">
                {columns.categories.map((category) => 
                    category.id !== "misc" && <div key={category.id} className="mb-5">
                        <h2 className="text-2xl font-bold">{category.name}</h2>
                        {category.attributes.map((attribute) => 
                            <div key={attribute.id} className="grid grid-cols-4 items-center px-4 py-2 odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                <span className="text-ellipsis font-semibold overflow-hidden" title={attribute.name}>{attribute.name}</span>
                                <div 
                                    className="col-span-2 h-4 rounded-full overflow-hidden bg-zinc-400 dark:bg-zinc-700" 
                                    title={`${attribute.name}: ${stats.get(attribute.id, true)}`}
                                >
                                    <div className={`h-4 rounded-full ${getClassForValue(stats.get(attribute.id, true) as number)}`} style={{ width: `${(stats.get(attribute.id, true) as number) * 100}%` }}></div>
                                </div>
                                <span className="text-right">
                                    <span title={`Base ${attribute.name}: ${stats.get(attribute.id, false)}`}>
                                        {Math.round(1000 * (stats.get(attribute.id, false) as number)) / 1000}
                                    </span>
                                    {stats.hasItemAdjustment(attribute.id) && 
                                        <>
                                            <span className="mx-1">{stats.adjustments[attribute.id] > 0 ? "+" : "-"}</span>
                                            <span className={stats.adjustments[attribute.id] > 0 ? "text-sky-500" : "text-red-500"} title={`${attribute.name} from items: ${stats.adjustments[attribute.id]}`}>
                                                {Math.round(1000 * Math.abs(stats.adjustments[attribute.id])) / 1000}
                                            </span>
                                        </>
                                    }  
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
	)
}

PlayerPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}

type PlayerCardStarsProps = {
    baseRating: number,
    adjustedRating?: number,
}

function PlayerCardStars({ baseRating, adjustedRating }: PlayerCardStarsProps) {
    const totalStars = 5 * (adjustedRating ?? baseRating)
    const starDiff = adjustedRating ? adjustedRating - baseRating : 0
    return (
        <div className="flex justify-center" title={`${totalStars} Stars`}>
            {Array.from(Array(Math.floor(totalStars)).keys()).map((index) => 
                <Emoji key={index} emoji="0x2B50" emojiClass="inline w-4 h-4 mr-0.5" />
            )}
            {totalStars % 1 && 
                <Emoji emoji="0x2B50" className="overflow-hidden" style={{ width: totalStars % 1 + "em"}} emojiClass="inline w-4 h-4 max-w-none"/>
            }
            <span className="font-semibold ml-2 before:content-['('] after:content-[')']">
                <span>{Math.round(500 * baseRating) / 100}</span>
                {starDiff !== 0 &&
                    <>
                        <span className="mx-1">{starDiff > 0 ? "+" : "-"}</span>
                        <span className={starDiff > 0 ? "text-sky-500" : "text-red-500"}>{Math.abs(Math.round(500 * starDiff) / 100)}</span>
                    </>
                }
            </span>
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

type PlayerCardItemProps = {
    item: Item | undefined,
    isLocked: boolean,
}

function PlayerCardItem({ item, isLocked }: PlayerCardItemProps) {
    return (
        <div className="flex flex-col justify-center items-center rounded-md px-2 py-4 bg-zinc-200 dark:bg-zinc-800">
            {item
                ? <>
                    <Emoji emoji={item.emoji} emojiClass="inline w-12 h-12 mb-2" />
                    <span className="text-center font-semibold">{item.name}</span>
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
                </>
                : <>
                    <Emoji emoji={isLocked ? "0x1F512" : "0x1F513"} emojiClass="inline w-12 h-12 mb-2" />
                    <span className="text-center">{isLocked ? "Locked" : "Empty"} Slot</span>
                </>
            }
        </div>
    )
}

function getClassForValue(value: number) {
    if(value > 1.45) {
        return "bg-fuchsia-400/50";
    } else if(value > 1.15) {
        return "bg-violet-300/50";
    } else if(value > 0.95) {
        return "bg-blue-300/60";
    } else if(value > 0.85) {
        return "bg-teal-400/50";
    } else if(value > 0.65) {
        return "bg-green-300/60";
    }  else if(value < 0.15) {
        return "bg-red-500/60";
    } else if(value < 0.25) {
        return "bg-orange-400/60";
    } else if(value < 0.45) {
        return "bg-amber-300/60";
    } else {
        return "bg-lime-300/50";
    };
}