import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlayerItem from '../../components/playeritem'
import { PageProps } from '../_app'

type ItemPageProps = PageProps & {
	
}

export default function ItemPage({ leagueData }: ItemPageProps) {
    const router = useRouter()
    const { id } = router.query
    
	const item = leagueData?.items[id as string]
    const owners = leagueData?.armory[id as string].map((player) => {
        return {
            player: player,
            team: leagueData?.positions[player.id].team,
        }
    })
	if(!item) {
		return (
			<h1>Loading...</h1>
		)
	}
    
	return (
        <section className="flex grow justify-center items-center">
            <div className="p-4 border-[1px] border-zinc-500 dark:border-white rounded-md overflow-auto max-h-[70vh]">
                <PlayerItem item={item} owners={owners} showDetails={true} showModEmojis={true} showStats={true} />
            </div>
        </section>
	)
}

ItemPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}