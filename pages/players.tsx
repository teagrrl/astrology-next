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

const { publicRuntimeConfig } = getConfig()

const reverseAttributes = getReverseAttributes(playerColumns)

const showPlayerStates = ["ALL", "ACTIVE", "INACTIVE"] as const
type ShowPlayersState = typeof showPlayerStates[number]

export default function PlayersPage({ players, error, isShowColors, isShowSimplified, isItemApplied, scaleColors }: PageProps) {
    const router = useRouter()
    const { page, sort, direction, filter } = router.query
    const queryFilter = filter ? filter.toString().toUpperCase() as ShowPlayersState : undefined
    const playersFilter = queryFilter && showPlayerStates.includes(queryFilter) ? queryFilter : undefined
            
	if(!players) {
		return <AstrologyLoader />
	}
    if(error) { 
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "asc" // sort by id ascending

    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    let filteredPlayers: Player[]
    switch(playersFilter) {
        case "ALL":
            filteredPlayers = Array.from(players)
            break
        case "INACTIVE":
            filteredPlayers = players.filter((player) => !player.team || !player.rosterSlots.length)
            break
        case "ACTIVE":
        default:
            filteredPlayers = players.filter((player) => player.team && player.rosterSlots.length > 0)
            break
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
	
	return (
        <section className="overflow-auto">
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
            <div className="px-2 py-1 mt-4">
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