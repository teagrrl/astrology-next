import React, { ReactElement } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Player, { PlayerComparator } from '@models/player2'
import { getReverseAttributes, playerColumns } from '@models/columns2'
import { PageProps } from '@pages/_app'
import AstrologyError from '@components/error'
import Layout from '@components/layout'
import AstrologyLoader from '@components/loader'
import PlayerTable from '@components/playertable'
import Emoji from '@components/emoji'
import Pagination from '@components/pagination'
import { exportPlayerData } from '@components/exportcsv'
import PlayerFilters, { FilterOptions, FilterState } from '@components/playerfilters'
import { ParsedUrlQueryInput } from 'querystring'
import fuzzysort from 'fuzzysort'

const { publicRuntimeConfig } = getConfig()

const reverseAttributes = getReverseAttributes(playerColumns)

export default function PlayersPage({ players, error, isShowColors, isShowSimplified, isItemApplied, scaleColors }: PageProps) {
    const router = useRouter()
    const { page, sort, direction, filter, search, locations, positions, modifications } = router.query
    const queryFilter = filter ? filter.toString().toUpperCase() : undefined
    const querySearch = search ? search.toString() : undefined
    const queryLocations = (locations ? typeof locations === "string" ? locations.split(",") : locations : [])
    const queryPositions = (positions ? typeof positions === "string" ? positions.split(",") : positions : [])
    const queryModifications = (modifications ? typeof modifications === "string" ? modifications.split(",") : modifications : [])

	if(!players) {
		return <AstrologyLoader />
	}
    if(error) { 
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const knownModifications = Array.from(new Set(players.map((player) => player.modifications.map((modification) => modification.name)).flat())).sort()

    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "asc" // sort by id ascending

    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    let filteredPlayers: Player[] = Array.from(players)
    switch(queryFilter) {
        case "ALL":
            break
        case "INACTIVE":
            filteredPlayers = filteredPlayers.filter((player) => !player.team || !player.rosterSlots.length)
            break
        case "ACTIVE":
        default:
            filteredPlayers = filteredPlayers.filter((player) => player.team && player.rosterSlots.length > 0)
            break
    }
    if(queryLocations.length > 0) {
        const upperCaseLocations = queryLocations.map((mod) => mod.toUpperCase())
        filteredPlayers = filteredPlayers.filter((player) => (upperCaseLocations.includes("SOMEWHERE") && !player.rosterSlots.length) || player.rosterSlots.filter((slot) => upperCaseLocations.includes(slot.location)).length > 0)
    }
    if(queryPositions.length > 0) {
        const lowerCasePositions = queryPositions.map((mod) => mod.toLowerCase())
        filteredPlayers = filteredPlayers.filter((player) => (lowerCasePositions.includes("somewhere") && !player.positions.length) || player.positions.filter((position) => lowerCasePositions.includes(position.name.toLowerCase())).length > 0)
    }
    if(queryModifications.length > 0) {
        const lowerCaseModifications = queryModifications.map((mod) => mod.toLowerCase())
        filteredPlayers = filteredPlayers.filter((player) => player.modifications.filter((mod) => lowerCaseModifications.includes(mod.name.toLowerCase())).length > 0)
    }
    if(querySearch) {
        const searchedNames = fuzzysort.go(querySearch, filteredPlayers, { threshold: -25, key: "name" })
        filteredPlayers = searchedNames?.map((result) => result.obj) ?? filteredPlayers
    }
    const sortedPlayers = filteredPlayers.sort(PlayerComparator(currentSort, currentDirection, isItemApplied))
    const pagePlayers = sortedPlayers.slice(currentPage * pageLimit, Math.min((currentPage + 1) * pageLimit, sortedPlayers.length))
    const numPages = Math.ceil(sortedPlayers.length / pageLimit)

    const sortPlayers = (newSort: string) => {
        let newDirection: "asc" | "desc" | undefined = undefined;
        if(newSort === currentSort) {
            switch(currentDirection) {
                case "asc":
                    newDirection = reverseAttributes.includes(newSort) ? "desc" : undefined
                    break;
                case "desc":
                    newDirection = reverseAttributes.includes(newSort) ? undefined : "asc"
                    break;
            }
        } else {
            newDirection = reverseAttributes.includes(newSort) ? "asc" : "desc"
        }
        router.push({
            query: buildQueryParams(querySearch, queryFilter, queryLocations, queryPositions, queryModifications, newSort, newDirection)
        }, undefined, { shallow: true })
    }

    function filterPlayers(options: FilterOptions) {
        router.push({
            query: buildQueryParams(options.search, options.state, options.locations, options.positions, options.modifications, currentSort, currentDirection)
        }, undefined, { shallow: true })
    }
	
	return (
        <section className="overflow-auto">
            <PlayerFilters filters={{ search: querySearch, state: queryFilter as FilterState, locations: queryLocations, positions: queryPositions, modifications: queryModifications, }} knownModifications={knownModifications} onUpdateFilters={filterPlayers} />
            <div className="flex justify-center items-center text-center p-5 gap-2">
                <Emoji className="h-14 w-14 flex justify-center items-center rounded-full" style={{ backgroundColor: "#424242" }} emoji={"0x26BE"} emojiClass="h-8 w-8" />
                <div>
                    <div className="text-3xl font-bold">
                        <span>The Players</span>
                    </div>
                    <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">We are all love Blaseball.</div>
                </div>
            </div>
            <Pagination 
                href={{ 
                    pathname: "/players",
                    query: {
                        search: querySearch,
                        filter: queryFilter,
                        locations: queryLocations,
                        positions: queryPositions,
                        modifications: queryModifications,
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                    },
                }} 
                exportData={{
                    data: exportPlayerData(sortedPlayers, isItemApplied), 
                    filename: "players",
                }}
                currentPage={currentPage}
                numPages={numPages} 
            />
            {players.length > 0 && pagePlayers.length > 0 
                ? <PlayerTable 
                    players={pagePlayers} 
                    sort={currentSort} 
                    direction={currentDirection} 
                    triggerSort={sortPlayers}
                    isShowColors={isShowColors}
                    isShowSimplified={isShowSimplified} 
                    isItemApplied={isItemApplied} 
                    scaleColors={scaleColors}
                /> 
                : <h1 className="text-3xl text-center font-bold p-5">Huh, it looks like not enough players with that criteria exist.</h1>
            }
            <Pagination 
                href={{ 
                    pathname: "/players",
                    query: {
                        search: querySearch,
                        filter: queryFilter,
                        locations: queryLocations,
                        positions: queryPositions,
                        modifications: queryModifications,
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                    },
                }} 
                exportData={{
                    data: exportPlayerData(sortedPlayers, isItemApplied), 
                    filename: "players",
                }}
                currentPage={currentPage}
                numPages={numPages} 
            />
            <div className="px-2 pt-4 pb-4">
                <span>Don&apos;t see what you&apos;re looking for? </span> 
                    <Link href={`/legacy/players`}><a className="py-0.5 rounded-md transition-all hover:px-1.5 hover:font-semibold hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white">Try the legacy version.</a></Link>
            </div>
        </section>
	)
}

PlayersPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Players - Astrology" 
            description="Compare the Star Charts and hidden attributes of every Player in Blaseball." 
            hasFooter={true} 
            {...props}
        >
			{page}
		</Layout>
	)
}

function buildQueryParams(search?: string, filter?: string, locations?: string[], positions?: string[], modifications?: string[], sort?: string, direction?: "asc" | "desc") {
    const query: ParsedUrlQueryInput = {}
    if(search) query.search = search
    if(filter) query.filter = filter
    if(locations) query.locations = locations
    if(positions) query.positions = positions
    if(modifications) query.modifications = modifications
    if(sort && direction) {
        query.sort = sort
        query.direction = direction
    }
    return query
}