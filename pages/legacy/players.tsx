import fuzzysort from 'fuzzysort'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import AstrologyError from '@components/error'
import { exportPlayerData } from '@components/legacy/exportcsv'
import Layout from '@components/legacy/layout'
import AstrologyLoader from '@components/loader'
import Pagination from '@components/pagination'
import PlayerTable from '@components/legacy/playertable'
import TeamHeader from '@components/legacy/teamheader'
import Player, { PlayerComparator } from '@models/player'
import { reverseAttributes } from '@models/playerstats'
import Team, { AllPlayers, groupTeams } from '@models/team'
import { PageProps } from '@pages/_app'
import { removeDiacritics } from '@models/helpers'

const { publicRuntimeConfig } = getConfig()

type Universe = {
    id: string,
    name: string,
    teams: Team[],
}
export default function PlayersPage({ leagueData, isShowSimplified, isItemApplied }: PageProps) {
    const router = useRouter()
    const { page, sort, direction, universes, name, deceased, positions, modifications, collision } = router.query
            
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }

    const availableUniverses = groupTeams(leagueData.teams || []).groups
    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
            
    const currentUniverseIds = (typeof universes === "string" ? universes.split(",") : universes ?? [])
    const currentUniverses = currentUniverseIds
        .map((id) => availableUniverses.find((group) => group.id === id))
        .filter((universe: Universe | undefined): universe is Universe => universe !== undefined)
    const uniqueUniversePlayers = Object.fromEntries(currentUniverses
        .reduce((teams: Team[], universe) => teams.concat(universe.teams), [])
        .map((team) => leagueData.rosters[team.id])
        .reduce((players: Player[], rosters) => {
            return players.concat(rosters.lineup, rosters.rotation, rosters.shadows)
        }, [])
        .map((player) => [player.id, player]))
    const currentUniversePlayers = Object.values(uniqueUniversePlayers).sort((player1, player2) => {
        if(player1.id > player2.id) return 1
        if(player1.id < player2.id) return -1
        return 0
    })
    const currentName = name ? removeDiacritics(name.toString()) : undefined
    const isDeceased = deceased && ["true", "false"].includes(deceased.toString()) ? deceased : undefined
    const currentPositions = (typeof positions === "string" ? positions.split(",") : positions ?? [])
    const currentModifications = (typeof modifications === "string" ? modifications.split(",") : modifications ?? [])
    const duplicateType = collision && collision.length > 0 && ["name", "slug"].includes(collision.toString()) ? collision : undefined
    
    const allPlayers = leagueData.players ?? []
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    let filteredPlayers = currentUniversePlayers.length > 0 ? currentUniversePlayers : allPlayers
    if(isDeceased) {
        filteredPlayers = filteredPlayers.filter((player) => 
            (player.data.deceased && isDeceased === "true") || (!player.data.deceased && isDeceased === "false")
        )
    }
    if(currentPositions.length > 0) {
        filteredPlayers = filteredPlayers.filter((player) => 
            currentPositions.filter((position) => 
                leagueData.positions[player.id].position === position
            ).length > 0
        )
    }
    if(currentModifications.length > 0) {
        filteredPlayers = filteredPlayers.filter((player) => 
            currentModifications.filter((id) => 
                player.modifications().map((mod) => mod.toLowerCase()).includes(id.toLowerCase())
            ).length > 0
        ) 
    }
    if(duplicateType) {
        filteredPlayers = filteredPlayers.filter((player1) => 
            filteredPlayers.some((player2) => 
                player1.id !== player2.id 
                && ((duplicateType === "name" && player1.canonicalName() === player2.canonicalName()) 
                    || (duplicateType === "slug" && player1.slug() === player2.slug())
                )
            )
        ) 
    }
    const searchablePlayers = filteredPlayers.map((player) => {
        return {
            name: removeDiacritics(player.canonicalName()),
            modifications: player.modifications().join(","),
            player: player,
        }
    })
    const searchedNames = currentName ? fuzzysort.go(currentName, searchablePlayers, { threshold: -25, key: "name" }) : undefined
    const searchPlayers = searchedNames?.map((result) => result.obj.player) ?? filteredPlayers
    const sortedPlayers = currentSort ? Array.from(searchPlayers).sort(PlayerComparator(leagueData.positions, currentSort, currentDirection, isItemApplied)) : searchPlayers
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
        const routerQuery: Record<string, string | string[]> = {}
        if(currentName) {
            routerQuery["name"] = currentName
        }
        if(currentUniverseIds) {
            routerQuery["universes"] = currentUniverseIds
        }
        if(currentPositions) {
            routerQuery["positions"] = currentPositions
        }
        if(currentModifications) {
            routerQuery["modifications"] = currentModifications
        }
        if(isDeceased) {
            routerQuery["deceased"] = isDeceased
        }
        if(duplicateType) {
            routerQuery["collision"] = duplicateType
        }
        if(newDirection) {
            routerQuery["sort"] = newSort
            routerQuery["direction"] = newDirection
        } 
        router.push({
            query: routerQuery
        }, undefined, { shallow: true })
    }
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={AllPlayers} />
            {currentUniverses.length > 0 && <div className="text-lg text-center font-semibold">Currently only showing players from {currentUniverses.map((universe) => universe.name).join(" & ")}</div>}
            <Pagination 
                href={{ 
                    pathname: "/legacy/players",
                    query: {
                        name: currentName,
                        universes: currentUniverseIds,
                        positions: currentPositions,
                        modifications: currentModifications,
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                        deceased: isDeceased,
                        collision: duplicateType,
                    },
                }} 
                exportData={{
                    data: exportPlayerData(sortedPlayers, leagueData.positions, isShowSimplified, isItemApplied), 
                    filename: "players",
                }}
                currentPage={currentPage}
                numPages={numPages} 
            />
            {allPlayers.length > 0 && pagePlayers.length > 0 
                ? <PlayerTable 
                    players={pagePlayers} 
                    positions={leagueData.positions} 
                    sort={currentSort} 
                    direction={currentDirection} 
                    triggerSort={sortPlayers}
                    isShowSimplified={isShowSimplified} 
                    isItemApplied={isItemApplied} 
                /> 
                : <h1 className="text-3xl text-center font-bold p-5">Huh, it looks like not enough players with that criteria exist.</h1>
            }
            <Pagination 
                href={{ 
                    pathname: "/legacy/players",
                    query: {
                        name: currentName,
                        universes: currentUniverseIds,
                        positions: currentPositions,
                        modifications: currentModifications,
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                        deceased: isDeceased,
                        collision: duplicateType,
                    },
                }} 
                exportData={{
                    data: exportPlayerData(sortedPlayers, leagueData.positions, isShowSimplified, isItemApplied), 
                    filename: "players",
                }}
                currentPage={currentPage}
                numPages={numPages} 
            />
        </section>
	)
}

PlayersPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Players - Astrology" 
            description="Compare the star charts and hidden attributes of every player in Blaseball." 
            hasFooter={true} 
            {...props}
        >
			{page}
		</Layout>
	)
}