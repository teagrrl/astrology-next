import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { averageReverseAttributes } from '../../components/averagestat'
import AstrologyError from '../../components/error'
import Layout from '../../components/layout'
import AstrologyLoader from '../../components/loader'
import SqueezerTable from '../../components/squeezertable'
import TeamHeader from '../../components/teamheader'
import Team, { groupTeams, StatSqueezer } from '../../models/team'
import { Averages } from '../api/chronicler'
import { PageProps } from '../_app'

const AverageComparator = (averages: Record<string, Averages>, ranks: Record<string, number>, column: string, direction?: "asc" | "desc", isItemApplied?: boolean) => {
    return (team1: Team, team2: Team) => {
        let comparison = 0
        const attribute1 = getSqueezerAttribute(team1, averages, ranks, column, isItemApplied)
        const attribute2 = getSqueezerAttribute(team2, averages, ranks, column, isItemApplied)
        if(attribute1 !== attribute2) {
            if (attribute1 > attribute2 || attribute1 === void 0) comparison = 1;
            if (attribute1 < attribute2 || attribute2 === void 0) comparison = -1;
        }
        comparison = attribute1 > attribute2 ? -1 : 1
        if(averageReverseAttributes.includes(column) && direction !== "desc") {
            comparison *= -1
        } else if(direction === "asc") {
            comparison *= -1
        }
        return comparison
    }
}

function getSqueezerAttribute(team: Team, averages: Record<string, Averages>, ranks: Record<string, number>, attribute: string, isItemApplied?: boolean) {
    switch(attribute) {
        case "name":
            return team.canonicalName()
        case "modifications":
            return team.modifications().length
        case "rank":
            return ranks[team.id]
        default:
            return averages[team.id].roster[isItemApplied ? 1 : 0][attribute] ?? 0
    }
}

export default function SqueezerPage({ leagueData, isItemApplied, isShowSimplified }: PageProps) {
    const router = useRouter()
    const { groupId, sort, direction } = router.query

	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    const { groups } = groupTeams(leagueData.teams || [])
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (averageReverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
    const currentGroup = groups.find((group) => groupId === group.id)
    const filteredTeams = currentGroup?.teams.filter((team) => team.data.lineup.length + team.data.rotation.length > 0) ?? []
    const groupRanks = getSqueezerRanks(currentGroup?.teams ?? [], leagueData.averages ?? {}, isItemApplied)
    const sortedTeams = currentSort ? Array.from(filteredTeams).sort(AverageComparator(leagueData.averages ?? {}, groupRanks, currentSort, currentDirection, isItemApplied)) : filteredTeams

    const sortTeams = (newSort: string) => {
        let newDirection: "asc" | "desc" | null = null;
        if(newSort === currentSort) {
            switch(currentDirection) {
                case "asc":
                    newDirection = averageReverseAttributes.includes(newSort) ? "desc" : null
                    break;
                case "desc":
                    newDirection = averageReverseAttributes.includes(newSort) ? null : "asc"
                    break;
            }
        } else {
            newDirection = averageReverseAttributes.includes(newSort) ? "asc" : "desc"
        }
        if(newDirection) {
            router.push({
                query: {
                    groupId: groupId,
                    sort: newSort,
                    direction: newDirection,
                }
            }, undefined, { shallow: true })
        } else {
            router.push({
                query: {
                    groupId: groupId,
                }
            }, undefined, { shallow: true })
        }
    }

	return (
        <section className="overflow-auto">
            <TeamHeader team={StatSqueezer} />
            <ul className="flex flex-row flex-wrap gap-2 justify-center px-4 pb-2">
                {groups.map((group) => 
                    <li key={group.id} className="flex">
                        <Link href={{
                            pathname: "[groupId]",
                            query: {
                                groupId: group.id,
                            },
                        }}>
                            <a className="px-2.5 py-1 font-semibold rounded-md bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500">{group.name}</a>
                        </Link>
                    </li>
                )}
            </ul>
            {currentGroup && <h1 className="my-2 text-center text-2xl font-bold">{currentGroup.name}</h1>}
            <SqueezerTable 
                teams={sortedTeams}
                averages={leagueData.averages}
                ranks={groupRanks}
                sort={currentSort} 
                direction={currentDirection} 
                triggerSort={sortTeams}
                isItemApplied={isItemApplied}
                isShowSimplified={isShowSimplified} 
            />
        </section>
	)
}

SqueezerPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}

function getSqueezerRanks(teams: Team[], averages: Record<string, Averages>, isItemApplied?: boolean) {
    const rankings = teams.map((team) => {
        return {
            id: team.id,
            value: (averages[team.id].roster[isItemApplied ? 1 : 0]["wobabr"] + averages[team.id].roster[isItemApplied ? 1 : 0]["erpr"]) / 2,
        }
    })
    rankings.sort((rank1, rank2) => rank2.value - rank1.value)
    const ranks: Record<string, number> = {}
    rankings.forEach((ranking, index) => {
        ranks[ranking.id] = index
    })
    return ranks
}