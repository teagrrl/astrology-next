import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AstrologyError from '../components/error'
import Layout from '../components/layout'
import AstrologyLoader from '../components/loader'
import PlayerTable from '../components/playertable'
import TeamHeader from '../components/teamheader'
import Player, { PlayerComparator } from '../models/player'
import { reverseAttributes } from '../models/playerstats'
import { TheHall } from '../models/team'
import { useChroniclerToFetchTributes } from './api/chronicler'
import { PageProps } from './_app'

export default function PlayerTributesPage({ leagueData, isShowSimplified, isItemApplied }: PageProps) {
    const router = useRouter()
    const { sort, direction } = router.query
    const tributes = useChroniclerToFetchTributes()

	if(!leagueData || !tributes) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    if(tributes.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${tributes.error}`} />
    }
    
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
            
    const players = tributes.playerIds
        .map(((id) => leagueData.players.find((player) => player.id === id)))
        .filter((player): player is Player => player !== undefined)
	const sortedPlayers = currentSort ? Array.from(players).sort(PlayerComparator(leagueData.positions, currentSort, currentDirection)) : players
    
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
                },
            }, undefined, { shallow: true })
        } else {
            router.push({}, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={TheHall} />
            <PlayerTable 
                players={sortedPlayers} 
                positions={leagueData.positions} 
                sort={currentSort} 
                direction={currentDirection} 
                triggerSort={sortPlayers}
                isShowSimplified={isShowSimplified} 
                isItemApplied={isItemApplied} 
            />
        </section>
	)
}

PlayerTributesPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}