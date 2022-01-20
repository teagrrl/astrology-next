import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlayerTable from '../../components/playertable'
import { PageProps } from '../_app'
import TeamHeader from '../../components/teamheader'

type TeamPageProps = PageProps & {
	
}

export default function TeamPage({ leagueData, isItemApplied, isShowSimplified }: TeamPageProps) {
    const router = useRouter()
    const { slugOrId } = router.query

	const team = leagueData?.teams.find((team) => team.id === slugOrId || team.slug() === (slugOrId as string).toLowerCase())
	if(!team) {
		return (
			<h1>Loading...</h1>
		)
	}
	const rosters = leagueData?.rosters[team.id]
	
	return (
        <section className="overflow-auto">
			<TeamHeader team={team} />
			<PlayerTable header="Lineup" players={rosters?.lineup} positions={leagueData?.positions} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
			<PlayerTable header="Rotation" players={rosters?.rotation} positions={leagueData?.positions} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
			<PlayerTable header="Shadows" players={rosters?.shadows} positions={leagueData?.positions} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
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