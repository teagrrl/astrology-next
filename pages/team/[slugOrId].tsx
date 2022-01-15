import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Emoji from '../../components/emoji'
import Layout from '../../components/layout'
import { useChroniclerToFetchLeagueData } from '../../useChronicler'
import PlayerTable from '../../components/playertable'
import { PageProps } from '../_app'

type TeamPageProps = PageProps & {
	
}

export default function TeamPage({ canSeeFk, isItemApplied }: TeamPageProps) {
    const router = useRouter()
    const { slugOrId } = router.query
	const data = useChroniclerToFetchLeagueData()

	const team = data?.teams.find((team) => [team.id, team.slug()].includes(slugOrId as string))
	if(!team) {
		return (
			<h1>Loading...</h1>
		)
	}
	const rosters = data?.rosters[team.id]
	
	return (
        <section className="overflow-auto">
			<div className="flex justify-center items-center text-center p-5">
				<Emoji className="h-14 w-14 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team.data.secondaryColor }} emoji={team.data.emoji} emojiClass="h-8 w-8" />
				<div>
					<Link href={`https://blaseball.com/team/${team.id}`}><a className="text-3xl font-bold">{team.canonicalName()}</a></Link>
					<div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{team.data.slogan}</div>
				</div>
			</div>
			<PlayerTable header="Lineup" players={rosters?.lineup} positions={data?.positions} canSeeFk={canSeeFk} isItemApplied={isItemApplied} />
			<PlayerTable header="Rotation" players={rosters?.rotation} positions={data?.positions} canSeeFk={canSeeFk} isItemApplied={isItemApplied} />
			<PlayerTable header="Shadows" players={rosters?.shadows} positions={data?.positions} canSeeFk={canSeeFk} isItemApplied={isItemApplied} />
        </section>
	)
}

TeamPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}