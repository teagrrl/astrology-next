import getConfig from 'next/config'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import Pagination from '../components/pagination'
import PlayerTable from '../components/playertable'
import TeamHeader from '../components/teamheader'
import { AllPlayers } from '../models/team'
import { PageProps } from './_app'

const { publicRuntimeConfig } = getConfig()

export default function PlayersPage({ leagueData, isShowSimplified, isItemApplied }: PageProps) {
    const router = useRouter()
    const { page, sort, direction } = router.query

    const currentPage = page ? parseInt(page.toString()) : 0
    const allPlayers = leagueData?.players ?? []
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    const filteredPlayers = allPlayers
    const sortedPlayers = filteredPlayers
    const pagePlayers = sortedPlayers.slice(currentPage * pageLimit, Math.min((currentPage + 1) * pageLimit, sortedPlayers.length))
    const numPages = Math.ceil(sortedPlayers.length / pageLimit)
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={AllPlayers} />
            <Pagination basePath="/players?" currentPage={currentPage} numPages={numPages} />
            <PlayerTable players={pagePlayers} positions={leagueData?.positions} isShowSimplified={isShowSimplified} isItemApplied={isItemApplied} />
        </section>
	)
}

PlayersPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}