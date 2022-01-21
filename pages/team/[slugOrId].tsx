import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlayerTable from '../../components/playertable'
import { PageProps } from '../_app'
import TeamHeader from '../../components/teamheader'
import { reverseAttributes } from '../../models/playerstats'
import { PlayerComparator } from '../../models/player'

type TeamPageProps = PageProps & {
	
}

export default function TeamPage({ leagueData, isItemApplied, isShowSimplified }: TeamPageProps) {
    const router = useRouter()
    const { slugOrId, sort, direction } = router.query

	const team = leagueData?.teams.find((team) => team.id === slugOrId || team.slug() === (slugOrId as string).toLowerCase())
	if(!team) {
		return (
			<h1>Loading...</h1>
		)
	}
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
	const rosters = leagueData?.rosters[team.id]
	const comparator = currentSort ? PlayerComparator(leagueData?.positions, currentSort, currentDirection) : undefined
	const sortedRosters = [
		{
			header: "Lineup",
			players: comparator ? Array.from(rosters?.lineup ?? []).sort(comparator) : rosters?.lineup
		},
		{
			header: "Rotation",
			players: comparator ? Array.from(rosters?.rotation ?? []).sort(comparator) : rosters?.rotation
		},
		{
			header: "Shadows",
			players: comparator ? Array.from(rosters?.shadows ?? []).sort(comparator) : rosters?.shadows
		},
	]

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
            router.query.sort = newSort
            newDirection = reverseAttributes.includes(newSort) ? "asc" : "desc"
        }
        if(newDirection) {
            router.push({
				pathname: "[slugOrId]",
                query: {
					slugOrId: slugOrId,
                    sort: newSort,
                    direction: newDirection,
                },
            }, undefined, { shallow: true })
        } else {
            router.push({
				pathname: "[slugOrId]",
                query: {
					slugOrId: slugOrId,
				}
			}, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
			<TeamHeader team={team} />
			{sortedRosters.map((roster) => 
				<PlayerTable 
					key={roster.header}
					header={roster.header}
					players={roster.players} 
					positions={leagueData?.positions} 
					sort={currentSort} 
					direction={currentDirection} 
					triggerSort={sortPlayers}
					isShowSimplified={isShowSimplified} 
					isItemApplied={isItemApplied} 
				/>
			)}
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