import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AstrologyError from '../../../components/error'
import Layout from '../../../components/layout'
import AstrologyLoader from '../../../components/loader'
import Metadata from '../../../components/metadata'
import { PlayerCard } from '../../../components/playercard'
import Tooltip from '../../../components/tooltip'
import { columns } from '../../../models/columns'
import PlayerStats from '../../../models/playerstats'
import { PageProps } from '../../_app'

type PlayerPageProps = PageProps & {
	
}

export default function PlayerPage({ leagueData, isItemApplied }: PlayerPageProps) {
    const router = useRouter()
    const { slugOrId } = router.query

	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
	const player = leagueData.players.find((player) => player.id === slugOrId || player.slug() === (slugOrId as string).toLowerCase())
	if(!player) {
		return (
			<AstrologyError code={404} message="Astrology was unable to find data about any such player" />
		)
	}
    const team = leagueData.positions[player.id].team
    const stats = new PlayerStats(player)
	
	return (
        <section className="flex flex-col overflow-auto md:flex-row md:overflow-hidden">
            <Metadata
                title={`${player.canonicalName()} - Astrology`} 
                description={`Check out the details stats for ${player.canonicalName()}${team ? (" of the " + team.canonicalName()) : ""}.`} 
            />
            <PlayerCard player={player} team={team} stats={stats} isItemApplied={isItemApplied} />
            <div className="p-2 md:w-1/2 md:overflow-auto">
                {columns.categories.map((category) => 
                    category.id !== "misc" && <table key={category.id} className="table-fixed mb-5">
                        <tbody>
                            <tr>
                                <th className="text-left text-2xl font-bold" colSpan={3}>{category.name}</th>
                            </tr>
                            {category.attributes.map((attribute) => 
                                <tr key={attribute.id} className="odd:bg-zinc-200 dark:odd:bg-zinc-800">
                                    <td className="pl-4 py-2 font-semibold whitespace-nowrap">{attribute.name}</td>
                                    <td className="px-4 py-2 w-full">
                                        <Tooltip
                                            content={<div>
                                                <div className="text-center">
                                                    <span className="font-semibold">{attribute.name}: </span><span>{stats.get(attribute.id, true)}</span>
                                                    {isItemApplied && stats.hasItemAdjustment(attribute.id) && <div className="flex flex-col justify-center items-center w-full mt-2 pt-2 border-t-[1px] border-white dark:border-zinc-500">
                                                        <div>
                                                            <span className="font-semibold">Base: </span><span>{stats.get(attribute.id, false)}</span>
                                                        </div>
                                                        {player.items.map((item) => 
                                                            item.adjustments[attribute.id] && item.adjustments[attribute.id] !== 0 && <div key={`${attribute.id}_${item.id}`}>
                                                                <span className="font-semibold">{item.name}: </span><span className={item.adjustments[attribute.id] > 0 ? "text-sky-500" : "text-red-500"}>{item.adjustments[attribute.id] > 0 ? "+" : ""}{item.adjustments[attribute.id]}</span>
                                                            </div>
                                                        )}
                                                    </div>}
                                                </div>
                                            </div>}
                                        >
                                            <div className="h-4 rounded-full overflow-hidden bg-zinc-400 dark:bg-zinc-700">
                                                <div className={`h-4 rounded-full ${stats.getScaleClass(attribute.id)}`} style={{ width: `${(stats.get(attribute.id, true) as number) * 100}%` }}></div>
                                            </div>
                                        </Tooltip>
                                    </td>
                                    <td className="pr-4 py-2 text-right whitespace-nowrap">
                                        <span>{Math.round(1000 * (stats.get(attribute.id, false) as number)) / 1000}</span>
                                        {isItemApplied && stats.hasItemAdjustment(attribute.id) && <>
                                            <span className="mx-1">{stats.adjustments[attribute.id] > 0 ? "+" : "-"}</span>
                                            <span className={stats.adjustments[attribute.id] > 0 ? "text-sky-500" : "text-red-500"}>
                                                {Math.round(1000 * Math.abs(stats.adjustments[attribute.id])) / 1000}
                                            </span>
                                        </>}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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