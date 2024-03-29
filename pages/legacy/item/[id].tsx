import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import AstrologyError from '@components/error'
import Layout from '@components/legacy/layout'
import AstrologyLoader from '@components/loader'
import Metadata from '@components/metadata'
import PlayerItem from '@components/legacy/playeritem'
import { PageProps } from '@pages/_app'

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
        <section className="overflow-auto md:flex md:grow md:justify-center md:items-center">
            <Metadata
                title={`${titleOwner ?? ""}${item.name} - Astrology`} 
                description={`Check out ${titleOwner ?? "the"} ${item.name} on Astrology.`} 
            />
            <div className="m-4 md:p-4 md:border-[1px] md:border-zinc-500 md:dark:border-white md:rounded-md md:overflow-auto md:max-h-[70vh]">
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