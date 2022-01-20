import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Layout from '../../components/layout'
import { PlayerCard } from '../../components/playercard'
import { columns } from '../../models/columns'
import PlayerStats from '../../models/playerstats'
import { useChroniclerToFetchLeagueData } from '../api/chronicler'
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
            <PlayerCard player={player} team={team} stats={stats} />
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
                                    <div className={`h-4 rounded-full ${stats.getScaleClass(attribute.id)}`} style={{ width: `${(stats.get(attribute.id, true) as number) * 100}%` }}></div>
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