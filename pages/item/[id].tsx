import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlayerItem from '../../components/playeritem'
import { useChroniclerToFetchLeagueData } from '../api/chronicler'
import { PageProps } from '../_app'

type ItemPageProps = PageProps & {
	
}

export default function ItemPage({}: ItemPageProps) {
    const router = useRouter()
    const { id } = router.query
	const data = useChroniclerToFetchLeagueData()

    
	const item = data?.items[id as string]
    const owners = data?.armory[id as string].map((player) => {
        return {
            player: player,
            team: data?.positions[player.id].team,
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