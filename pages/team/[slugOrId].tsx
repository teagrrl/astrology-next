import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlayerTable from '../../components/playertable'
import { PageProps } from '../_app'
import TeamHeader from '../../components/teamheader'
import { reverseAttributes } from '../../models/playerstats'
import { PlayerComparator } from '../../models/player'
import AstrologyLoader from '../../components/loader'
import AstrologyError from '../../components/error'

type TeamPageProps = PageProps & {
	
}

export default function TeamPage({ leagueData, isItemApplied, isShowSimplified }: TeamPageProps) {
    const router = useRouter()
    const { slugOrId, sort, direction } = router.query

	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
	const team = leagueData.teams.find((team) => team.id === slugOrId || team.slug() === (slugOrId as string).toLowerCase())
	if(!team) {
		return <AstrologyError code={404} message="Astrology was unable to find data about any such team" />
	}
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
	const rosters = leagueData.rosters[team.id]
    if(!rosters.lineup.length && !rosters.rotation.length && !rosters.shadows.length) {
        return (
            <section>
				<TeamHeader team={team} />
        		<h1 className="flex justify-center text-xl">Hrm, it seems that the {team.canonicalName()} roster is completely empty.</h1>
				<p className="flex justify-center text-sm">(If you&apos;re interested, I can ask around to see if there are any openings.)</p>
            </section>
        )
    }
	const averages = leagueData.averages[team.id]
	const comparator = currentSort ? PlayerComparator(leagueData.positions, currentSort, currentDirection) : undefined
	const sortedRosters = [
		{
			id: "lineup",
			header: "Lineup",
			players: comparator ? Array.from(rosters?.lineup ?? []).sort(comparator) : rosters?.lineup,
			averages: averages.lineup,
		},
		{
			id: "rotation",
			header: "Rotation",
			players: comparator ? Array.from(rosters?.rotation ?? []).sort(comparator) : rosters?.rotation,
			averages: averages.rotation,
		},
		{
			id: "shadows",
			header: "Shadows",
			players: comparator ? Array.from(rosters?.shadows ?? []).sort(comparator) : rosters?.shadows,
			averages: averages.shadows,
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
            newDirection = reverseAttributes.includes(newSort) ? "asc" : "desc"
        }
        if(newDirection) {
            router.push({
                query: {
					slugOrId: slugOrId,
                    sort: newSort,
                    direction: newDirection,
                },
            }, undefined, { shallow: true })
        } else {
            router.push({
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
					key={roster.id}
					header={roster.header}
					players={roster.players} 
					positions={leagueData.positions} 
					averages={roster.averages}
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