import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Emoji from '../../../components/emoji'
import AstrologyError from '../../../components/error'
import Layout from '../../../components/layout'
import AstrologyLoader from '../../../components/loader'
import Metadata from '../../../components/metadata'
import PlayerHistoryTable from '../../../components/playerhistorytable'
import { useChroniclerToFetchPlayerHistory } from '../../api/chronicler'
import { PageProps } from '../../_app'

type PlayerHistoryPageProps = PageProps & {
	
}

export default function PlayerHistoryPage({ leagueData, isShowSimplified, isItemApplied }: PlayerHistoryPageProps) {
    const router = useRouter()
    const { slugOrId, sort } = router.query

	const player = leagueData?.players.find((player) => player.id === slugOrId || player.slug() === (slugOrId as string).toLowerCase())
    const history = useChroniclerToFetchPlayerHistory(player?.id)

	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
	if(!player) {
		return <AstrologyError code={404} message="Astrology was unable to find data about any such player" />
	}
    if(history.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${history.error}`} />
    }
	if(!history.data) {
		return <AstrologyError code={404} message={`Astrology was unable to load the detailed history for ${player.canonicalName()}`} />
	}
	if(!history.data.length) {
		return <AstrologyLoader message={`Loading historical data for ${player.canonicalName()}...`} />
	}
    
    const currentSort = sort ? sort.toString() as "asc" | "desc" : "asc"
    const sortedHistory = currentSort ? Array.from(history.data).sort((history1, history2) => {
        let comparison = history1.date > history2.date ? -1 : 1
        if(currentSort === "asc") {
            comparison *= -1
        }
        return comparison
    }) : history.data

    const sortHistory = () => {
        let newSort: "asc" | "desc";
        switch(currentSort) {
            case "asc":
                newSort = "desc"
                break;
            case "desc":
                newSort = "asc"
                break;
        }
        if(newSort) {
            router.push({
                query: {
                    slugOrId: slugOrId,
                    sort: newSort,
                }
            }, undefined, { shallow: true })
        } else {
            router.push({}, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
            <Metadata
                title={`Historical Data for ${player.canonicalName()} - Astrology`} 
                description={`Check out the historical star charts for ${player.canonicalName()}.`} 
            />
            <div className="flex justify-center items-center text-center p-5">
                <Link href={{
                    pathname: "/player/[slugOrId]",
                    query: {
                        slugOrId: slugOrId
                    }
                }}>
                    <a className="text-3xl font-bold mr-2" title="Back to player page">&laquo; {player.canonicalName()}</a>
                </Link>
                <a href={`https://blaseball.com/player/${player.id}`} title={`Go to official player page for ${player.canonicalName()}`}>
                    <Emoji emoji="0x1F517" emojiClass="w-7 h-7 " />
                </a>
            </div>
            <PlayerHistoryTable 
                history={sortedHistory} 
                teams={leagueData.teams}
                sort={currentSort} 
                triggerSort={sortHistory}
                isShowSimplified={isShowSimplified} 
                isItemApplied={isItemApplied}
            />
        </section>
	)
}

PlayerHistoryPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}