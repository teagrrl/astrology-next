import React, { ChangeEvent, ChangeEventHandler, EventHandler, FormEvent, ReactElement, useState } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Player, { fieldPositions, PlayerComparator } from '@models/player2'
import { getReverseAttributes, playerColumns } from '@models/columns2'
import { PageProps } from '@pages/_app'
import AstrologyError from '@components/error'
import Layout from '@components/layout'
import AstrologyLoader from '@components/loader'
import PlayerTable from '@components/playertable'
import Emoji from '@components/emoji'
import Pagination from '@components/pagination'
import { exportPlayerData } from '@components/exportcsv'
import Multiselect from 'multiselect-react-dropdown'
import fuzzysort from 'fuzzysort'

const { publicRuntimeConfig } = getConfig()

const reverseAttributes = getReverseAttributes(playerColumns)

const showPlayerStates = ["ALL", "ACTIVE", "INACTIVE"] as const
type ShowPlayersState = typeof showPlayerStates[number]
const playerPositions = [...fieldPositions, "Somewhere"].sort()

const SingleSelectStyle = {
    chips: {
        padding: "0 0.5rem",
    },
    searchBox: {
        color: "#000000",
        background: "#ffffff",
        borderColor: "#a1a1aa",
        borderRadius: "0.375rem",
        padding: "0.25rem 0.5rem",
    },
    inputField: {
        padding: 0,
    },
    optionContainer: {
        fontSize: "0.8rem",
        lineHeight: "1rem",
        color: "#000000",
    },
    option: {
        padding: "0.5rem 1rem",
    },
}

const MultiSelectStyle = {
    multiselectContainer: {
        width: "240px",
    },
    searchBox: {
        color: "#000000",
        background: "#ffffff",
        borderColor: "#a1a1aa",
        borderRadius: "0.375rem",
        padding: "0.25rem 0.5rem",
    },
    inputField: {
        width: "100%",
        padding: 0,
        margin: 0,
    },
    optionContainer: {
        fontSize: "0.8rem",
        lineHeight: "1rem",
        color: "#000000",
    },
    option: {
        padding: "0.5rem 1rem",
    },
}

export default function PlayersPage({ players, error, isShowColors, isShowSimplified, isItemApplied, scaleColors }: PageProps) {
    const router = useRouter()
    const { page, sort, direction, filter, search, locations, positions, modifications } = router.query
    const queryFilter = filter ? filter.toString().toUpperCase() as ShowPlayersState : undefined
    const playersFilter = queryFilter && showPlayerStates.includes(queryFilter) ? queryFilter : undefined
    const querySearch = search ? search.toString() : undefined
    const queryLocations = (locations ? typeof locations === "string" ? locations.split(",") : locations : []).map((location) => location.toUpperCase())
    const queryPositions = (positions ? typeof positions === "string" ? positions.split(",") : positions : []).map((position) => position.toLowerCase())
    const queryModifications = (modifications ? typeof modifications === "string" ? modifications.split(",") : modifications : []).map((mod) => mod.toLowerCase())

    const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false)
    const [filterState, setFilterState] = useState<ShowPlayersState>(queryFilter ? queryFilter : "ACTIVE")
    const [filterName, setFilterName] = useState<string | undefined>(querySearch)
    const [filterLocations, setFilterLocations] = useState<string[]>(queryLocations)
    const [filterPositions, setFilterPositions] = useState<string[]>(queryPositions)
    const [filterModifications, setFilterModifications] = useState<string[]>(queryModifications.map((mod) => mod[0].toUpperCase() + mod.substring(1)))

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
    switch(playersFilter) {
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
        filteredPlayers = filteredPlayers.filter((player) => (queryLocations.includes("SOMEWHERE") && !player.rosterSlots.length) || player.rosterSlots.filter((slot) => queryLocations.includes(slot.location)).length > 0)
    }
    if(queryPositions.length > 0) {
        filteredPlayers = filteredPlayers.filter((player) => (queryPositions.includes("somewhere") && !player.positions.length) || player.positions.filter((position) => queryPositions.includes(position.name.toLowerCase())).length > 0)
    }
    if(queryModifications.length > 0) {
        filteredPlayers = filteredPlayers.filter((player) => player.modifications.filter((mod) => queryModifications.includes(mod.name.toLowerCase())).length > 0)
    }
    if(querySearch) {
        const searchedNames = fuzzysort.go(querySearch, filteredPlayers, { threshold: -25, key: "name" })
        filteredPlayers = searchedNames?.map((result) => result.obj) ?? filteredPlayers
    }
    const sortedPlayers = filteredPlayers.sort(PlayerComparator(currentSort, currentDirection, isItemApplied))
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
        if(querySearch) {
            routerQuery["search"] = querySearch
        }
        if(queryLocations) {
            routerQuery["locations"] = queryLocations
        }
        if(queryPositions) {
            routerQuery["positions"] = queryPositions
        }
        if(queryModifications) {
            routerQuery["modifications"] = queryModifications
        }
        if(playersFilter) {
            routerQuery["filter"] = playersFilter
        }
        if(newDirection) {
            routerQuery["sort"] = newSort
            routerQuery["direction"] = newDirection
        } 
        router.push({
            query: routerQuery
        }, undefined, { shallow: true })
    }

    function selectFilterState(selectedFilter: string[]) {
        setFilterState(selectedFilter[0] as ShowPlayersState)
    }

    function changeFilterName(e: ChangeEvent<HTMLInputElement>) {
        setFilterName(e.target.value)
    }

    function selectLocations(selectedLocations: string[]) {
        setFilterLocations(selectedLocations)
    }

    function selectPositions(selectedPositions: string[]) {
        setFilterPositions(selectedPositions)
    }

    function selectModifications(selectedModifications: string[]) {
        setFilterModifications(selectedModifications)
    }

    function filterPlayers() {
        const routerQuery: Record<string, string | string[]> = {}
        if(filterName) {
            routerQuery["search"] = filterName
        }
        if(filterLocations) {
            routerQuery["locations"] = filterLocations
        }
        if(filterPositions) {
            routerQuery["positions"] = filterPositions
        }
        if(filterModifications) {
            routerQuery["modifications"] = filterModifications
        }
        if(filterState) {
            routerQuery["filter"] = filterState
        }
        if(currentSort) {
            routerQuery["sort"] = currentSort
            routerQuery["direction"] = currentDirection
        } 
        router.push({
            query: routerQuery
        }, undefined, { shallow: true })
        setIsFiltersExpanded(false)
    }
	
	return (
        <section className="overflow-auto">
            <div className="hidden lg:inline fixed top-0 left-2 z-10 max-h-full">
                {isFiltersExpanded && <div className="flex flex-col flex-grow gap-2 p-2 rounded-tr-md bg-zinc-100 dark:bg-zinc-600">
                    <div className="flex flex-col">
                        <label className="py-1 text-sm">Search by name:</label>
                        <input type="text" placeholder="Search by name..." className="form-input px-2 py-1 rounded-md text-black border-zinc-400" value={filterName ?? ""} onChange={changeFilterName} />
                    </div>
                    <div className="flex flex-col">
                        <label className="py-1 text-sm">Filter players by:</label>
                        <Multiselect 
                            singleSelect
                            isObject={false}
                            selectedValues={[filterState]}
                            options={showPlayerStates}
                            avoidHighlightFirstOption
                            onSelect={selectFilterState}
                            onRemove={selectFilterState}
                            placeholder="Filter players by..."
                            style={SingleSelectStyle}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="py-1 text-sm">Search by locations:</label>
                        <Multiselect 
                            isObject={false}
                            options={["LINEUP", "ROTATION", "SHADOWS", "SOMEWHERE"]}
                            selectedValues={filterLocations}
                            avoidHighlightFirstOption
                            onSelect={selectLocations}
                            onRemove={selectLocations}
                            closeIcon="cancel"
                            placeholder="Select locations..."
                            emptyRecordMsg="No more locations"
                            style={MultiSelectStyle}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="py-1 text-sm">Search by positions:</label>
                        <Multiselect 
                            isObject={false}
                            options={playerPositions}
                            selectedValues={filterPositions}
                            avoidHighlightFirstOption
                            onSelect={selectPositions}
                            onRemove={selectPositions}
                            closeIcon="cancel"
                            placeholder="Select positions..."
                            emptyRecordMsg="No more positions"
                            style={MultiSelectStyle}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="py-1 text-sm">Search by modifications:</label>
                        <Multiselect 
                            isObject={false}
                            options={knownModifications}
                            selectedValues={filterModifications}
                            avoidHighlightFirstOption
                            onSelect={selectModifications}
                            onRemove={selectModifications}
                            closeIcon="cancel"
                            placeholder="Select modifications..."
                            emptyRecordMsg="No more modifications"
                            style={MultiSelectStyle}
                        />
                    </div>
                    <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500" onClick={filterPlayers}>Update Filters</button>
                </div>}
                <button className="w-fit px-6 py-1 rounded-b-md font-semibold transition bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>Filters {isFiltersExpanded ? "\u25B2" : "\u25BC"}</button>
            </div>
            <div className="flex justify-center items-center text-center p-5">
                <Emoji className="h-14 w-14 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: "#424242" }} emoji={"0x26BE"} emojiClass="h-8 w-8" />
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
                        locations: queryLocations,
                        modifications: queryModifications,
                        filter: playersFilter,
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
                        locations: queryLocations,
                        modifications: queryModifications,
                        filter: playersFilter,
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
            <div className="px-2 pt-4 pb-4 lg:pb-10">
                <span>Don&apos;t see what you&apos;re looking for? </span> 
                <Link href="/legacy/players">Maybe try the legacy version.</Link>
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