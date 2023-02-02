import React, { ChangeEvent, useState } from "react"
import Multiselect from "multiselect-react-dropdown"
import { fieldPositions } from "@models/player2"

type PlayerFiltersProps = {
    filters: FilterOptions,
    knownModifications: string[],
    onUpdateFilters?: Function,
}

export type FilterOptions = {
    search?: string,
    state?: FilterState,
    locations?: string[],
    positions?: string[],
    modifications?: string[],
}

const playerStates = ["ALL", "ACTIVE", "INACTIVE"] as const
export type FilterState = typeof playerStates[number]
const playerLocations = ["LINEUP", "ROTATION", "SHADOWS", "SOMEWHERE"]
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
        overflow: "auto",
        maxHeight: "20vh",
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

export default function PlayerFilters({ filters, knownModifications, onUpdateFilters }: PlayerFiltersProps) {
    const parsedState = filters.state && playerStates.includes(filters.state) ? filters.state : "ACTIVE"
    const parsedLocations = playerLocations.filter((location) => filters.locations?.includes(location))
    const parsedPositions = playerPositions.filter((position) => filters.positions?.includes(position))
    const parsedModifications = knownModifications.filter((mod) => filters.modifications?.includes(mod))

    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [search, setSearch] = useState<string | undefined>(filters.search)
    const [state, setState] = useState<FilterState>(parsedState)
    const [locations, setLocations] = useState<string[]>(parsedLocations)
    const [positions, setPositions] = useState<string[]>(parsedPositions)
    const [modifications, setModifications] = useState<string[]>(parsedModifications)

    function changeSearch(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value)
    }

    function selectState(selectedFilter: FilterState[]) {
        setState(selectedFilter[0])
    }

    function selectLocations(selectedLocations: string[]) {
        setLocations(selectedLocations)
    }

    function selectPositions(selectedPositions: string[]) {
        setPositions(selectedPositions)
    }

    function selectModifications(selectedModifications: string[]) {
        setModifications(selectedModifications)
    }

    function updateFilters() {
        if(onUpdateFilters) {
            onUpdateFilters({ state, search, locations, positions, modifications, })
        }
        setIsExpanded(false)
    }

    function resetFilters() {
        // should this be reset or clear??
        setSearch(undefined)
        setState("ACTIVE")
        setLocations([])
        setPositions([])
        setModifications([])
        /*setSearch(filters.search)
        setState(filters.state ?? "ACTIVE")
        setLocations(filters.locations ?? [])
        setPositions(filters.positions ?? [])
        setModifications(filters.modifications ?? [])*/
    }

    return (
        <div className="hidden lg:inline fixed top-0 left-2 z-10 max-h-full">
            {isExpanded && <div className="flex flex-col flex-grow gap-2 p-2 rounded-tr-md bg-zinc-100 dark:bg-zinc-600">
                <div className="flex flex-col">
                    <label className="py-1 text-sm">Search by name:</label>
                    <input type="text" placeholder="Search by name..." className="form-input px-2 py-1 rounded-md text-black border-zinc-400" value={search ?? ""} onChange={changeSearch} />
                </div>
                <div className="flex flex-col">
                    <label className="py-1 text-sm">Filter players by:</label>
                    <Multiselect 
                        singleSelect
                        isObject={false}
                        selectedValues={[state]}
                        options={playerStates}
                        avoidHighlightFirstOption
                        onSelect={selectState}
                        onRemove={selectState}
                        placeholder="Filter players by..."
                        style={SingleSelectStyle}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="py-1 text-sm">Search by locations:</label>
                    <Multiselect 
                        isObject={false}
                        options={playerLocations}
                        selectedValues={locations}
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
                        selectedValues={positions}
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
                        selectedValues={modifications}
                        avoidHighlightFirstOption
                        onSelect={selectModifications}
                        onRemove={selectModifications}
                        closeIcon="cancel"
                        placeholder="Select modifications..."
                        emptyRecordMsg="No more modifications"
                        style={MultiSelectStyle}
                    />
                </div>
                <div className="flex flex-row gap-1">
                    <button className="flex-grow px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500" onClick={() => updateFilters()}>Update Filters</button>
                    <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-red-300 dark:hover:bg-red-600" onClick={() => resetFilters()}>Reset</button>
                </div>
            </div>}
            <button className="w-fit px-6 py-1 rounded-b-md font-semibold transition bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500" onClick={() => setIsExpanded(!isExpanded)}>Filters {isExpanded ? "\u25B2" : "\u25BC"}</button>
        </div>
    )
}