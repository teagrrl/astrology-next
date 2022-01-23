import getConfig from 'next/config'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import AstrologyError from '../components/error'
import Layout from '../components/layout'
import AstrologyLoader from '../components/loader'
import Pagination from '../components/pagination'
import PlayerTable from '../components/playertable'
import TeamHeader from '../components/teamheader'
import { PlayerComparator } from '../models/player'
import { reverseAttributes } from '../models/playerstats'
import { AllPlayers } from '../models/team'
import { PageProps } from './_app'

const { publicRuntimeConfig } = getConfig()

export default function PlayersPage({ leagueData, isShowSimplified, isItemApplied }: PageProps) {
    const router = useRouter()
    const { page, sort, direction } = router.query

    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"

            
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    const allPlayers = leagueData.players ?? []
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    const filteredPlayers = allPlayers
    const sortedPlayers = currentSort ? Array.from(filteredPlayers).sort(PlayerComparator(leagueData.positions, currentSort, currentDirection)) : filteredPlayers
    const pagePlayers = sortedPlayers.slice(currentPage * pageLimit, Math.min((currentPage + 1) * pageLimit, sortedPlayers.length))
    const numPages = Math.ceil(sortedPlayers.length / pageLimit)

    const sortPlayers = (newSort: string) => {
        let newDirection: "asc" | "desc" | null = null;
        if(newSort === currentSort) {
            switch(currentDirection) {
                case "asc":
                    newDirection = reverseAttributes.includes(newSort) ? "desc" : null
                    break;
                case "desc":
                    newDirection = reverseAttributes.includes(newSort) ? null : "asc"
                    break;
            }
        } else {
            newDirection = reverseAttributes.includes(newSort) ? "asc" : "desc"
        }
        if(newDirection) {
            router.push({
                query: {
                    sort: newSort,
                    direction: newDirection,
                }
            }, undefined, { shallow: true })
        } else {
            router.push({}, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={AllPlayers} />
            <Pagination href={{ 
                pathname: "/players",
                query: {
                    sort: currentSort,
                    direction: currentSort ? currentDirection : undefined,
                },
            }} currentPage={currentPage} numPages={numPages} />
            <PlayerTable 
                players={pagePlayers} 
                positions={leagueData.positions} 
                sort={currentSort} 
                direction={currentDirection} 
                triggerSort={sortPlayers}
                isShowSimplified={isShowSimplified} 
                isItemApplied={isItemApplied} 
            />
            <Pagination href={{ 
                pathname: "/players",
                query: {
                    sort: currentSort,
                    direction: currentSort ? currentDirection : undefined,
                },
            }} currentPage={currentPage} numPages={numPages} />
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