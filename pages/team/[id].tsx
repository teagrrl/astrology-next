import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { PageProps } from '@pages/_app'
import Layout from '@components/layout'
import AstrologyLoader from '@components/loader'
import AstrologyError from '@components/error'
import Metadata from '@components/metadata'
import Link from 'next/link'
import PlayerTable from '@components/playertable'
import Player, { PlayerComparator } from '@models/player2'
import { getReverseAttributes, playerColumns } from '@models/columns2'
import TeamHeader from '@components/teamheader'
import ExportCSV, { exportPlayerData } from '@components/exportcsv'
import Tooltip from '@components/tooltip'

type TeamPageProps = PageProps & {}

const reverseAttributes = getReverseAttributes(playerColumns)

export default function TeamPage({ teams, error, isShowColors, isItemApplied, isShowSimplified, scaleColors }: TeamPageProps) {
    const router = useRouter()
    const { id, sort, direction } = router.query

	if(!teams) {
		return <AstrologyLoader />
	}
	const team = teams.find((team) => team.id === id)
	if(!team) {
		return <AstrologyError code={404} message="Astrology was unable to find data about any such team" />
	}
    if(error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"

    if(!team.lineup.length && !team.rotation.length && !team.shadows.length) {
        return (
            <section>
				<TeamHeader team={team} />
        		<h1 className="flex justify-center text-xl">Hrm, it seems that the {team.name} roster is completely empty.</h1>
				<p className="flex justify-center text-sm">(If you&apos;re interested, I can ask around to see if there are any openings.)</p>
            </section>
        )
    }

    const comparator = currentSort ? PlayerComparator(currentSort, currentDirection, isItemApplied) : undefined
    
    const rosterData = [
        {
            header: "Lineup",
            players: comparator ? Array.from(team.lineup).sort(comparator) : team.lineup,
            averages: getRosterAverages(team.lineup),
        },
        {
            header: "Rotation",
            players: comparator ? Array.from(team.rotation).sort(comparator) : team.rotation,
            averages: getRosterAverages(team.rotation),
        },
        {
            header: "Shadows",
            players: comparator ? Array.from(team.shadows).sort(comparator) : team.shadows,
            averages: getRosterAverages(team.shadows),
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
					id: id,
                    sort: newSort,
                    direction: newDirection,
                },
            }, undefined, { shallow: true })
        } else {
            router.push({
                query: {
					id: id,
				}
			}, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
			<Metadata
				title={`${team.name} - Astrology`} 
				description={`Read the star charts for the ${team.name}.`} 
			/>
            <TeamHeader team={team} />
            <div className="flex flex-row p-2 gap-2">
                <div className="flex flex-row flex-grow gap-2 items-center">
                    {team.modifications.map((mod, index) =>
                        <Tooltip key={`modification_${index}`} content={mod.description}>
                            <div className="px-3 py-1 border-2 rounded-md font-bold cursor-default" style={{ borderColor: mod.color, backgroundColor: mod.backgroundColor, color: mod.textColor }}>
                                {mod.name}
                            </div>
                        </Tooltip>
                    )}
                </div>
                <ExportCSV data={exportPlayerData(rosterData.map((data) => data.players).flat(), isItemApplied)} filename={team.id} />
            </div>
            {rosterData.map((data, index) =>
                <PlayerTable 
                    key={`table_${index}`} 
                    header={data.header}
                    players={data.players} 
                    averages={data.averages}
                    sort={currentSort} 
                    direction={currentDirection} 
                    triggerSort={sortPlayers}
                    isShowColors={isShowColors}
                    isShowSimplified={isShowSimplified} 
                    isItemApplied={isItemApplied} 
                    scaleColors={scaleColors}
                />
            )}
            <div className="px-2 py-1 mt-4">
                <span>Don&apos;t see what you&apos;re looking for? </span> 
                <Link href={`/legacy/team/${team.id}`}>Maybe try the legacy version.</Link>
            </div>
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

function getRosterAverages(players: Player[]) {
    const averages: Record<string, number> = {}    
    for(const player of players) {
        for(const [name, value] of Object.entries(player.attributes)) {
            averages[name] = averages[name] ?? 0
            averages[name] += value
        }
    }
    for(const name of Object.keys(averages)) {
        averages[name] /= players.length
    }
    return averages
}