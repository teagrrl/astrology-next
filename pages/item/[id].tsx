import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AstrologyError from '../../components/error'
import Layout from '../../components/layout'
import AstrologyLoader from '../../components/loader'
import Metadata from '../../components/metadata'
import PlayerItem from '../../components/playeritem'
import { PageProps } from '../_app'

type ItemPageProps = PageProps & {
	
}

export default function ItemPage({ leagueData }: ItemPageProps) {
    const router = useRouter()
    const { id } = router.query
    
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    
	const item = id ? leagueData.items[id.toString()] : null
    if(!item) {
        return <AstrologyError code={404} message="Astrology was unable to find data about any such item" />
    }
    const owners = (leagueData.armory[item.id] ?? []).map((player) => {
        return {
            player: player,
            team: leagueData.positions[player.id].team,
        }
    })
    let titleOwner = owners.length === 1 ? owners[0].player.canonicalName() : undefined
    if(titleOwner) {
        titleOwner += titleOwner.endsWith("s") ? "' " : "'s ";
    }

	return (
        <section className="flex grow justify-center items-center">
            <Metadata
                title={`${titleOwner ?? ""}${item.name} - Astrology`} 
                description={`Check out ${titleOwner ?? "the"} ${item.name} on Astrology.`} 
            />
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