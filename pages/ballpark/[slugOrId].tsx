import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AstrologyError from '../../components/error'
import Layout from '../../components/layout'
import AstrologyLoader from '../../components/loader'
import Metadata from '../../components/metadata'
import { BallparkCard } from '../../components/ballparkcard'
import { useChroniclerToFetchBallparks } from '../api/chronicler'
import { PageProps } from '../_app'

type BallparkPageProps = PageProps & {
	
}

export default function BallparkPage({ leagueData }: BallparkPageProps) {
    const router = useRouter()
    const { slugOrId } = router.query
    const ballparks = useChroniclerToFetchBallparks()
    
	if(!leagueData || !ballparks) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    if(ballparks.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${ballparks.error}`} />
    }

    const ballpark = ballparks.data.find((ballpark) => ballpark.id === slugOrId || ballpark.slug() === (slugOrId as string).toLowerCase())
	if(!ballpark) {
		return (
			<AstrologyError code={404} message="Astrology was unable to find any such ballparks" />
		)
	}
    const team = leagueData.teams.find((team) => team.id === ballpark.data.teamId)

	return (
        <section className="overflow-auto md:flex md:grow md:justify-center md:items-center">
            <Metadata
                title={`${ballpark.data.name} - Astrology`} 
                description={`Check out the ${ballpark.data.nickname} on Astrology.`} 
            />
            <div className=" h-full p-4 md:flex md:items-center">
                <div className="h-full border-[1px] border-black dark:border-white overflow-hidden md:min-w-[50vw] md:max-h-[70vh] md:m-0 md:flex md:flex-col md:grow md:rounded-md">
                    <BallparkCard ballpark={ballpark} team={team} />
                </div>
            </div>
        </section>
	)
}

BallparkPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}