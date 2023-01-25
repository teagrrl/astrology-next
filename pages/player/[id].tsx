import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@components/layout'
import Metadata from '@components/metadata'
import AstrologyLoader from '@components/loader'
import AstrologyError from '@components/error'
import Emoji from '@components/emoji'
import { PageProps } from '@pages/_app'
import useSWR from 'swr'
import { Historical, playerHistoryFetcher } from '@models/api2'
import moment from 'moment'
import Tooltip from '@components/tooltip'
import Player, { PlayerSnapshot } from '@models/player2'
import PlayerHistoryTable from '@components/playerhistorytable'
import ExportCSV, { exportPlayerHistoryData } from '@components/exportcsv'

type PlayerPageProps = PageProps & {
	
}

export default function PlayerPage({ players, error, isShowColors, isShowSimplified, isItemApplied, scaleColors }: PlayerPageProps) {
    const router = useRouter()
    const { id, sort } = router.query
	const player = players?.find((player) => player.id === id)
    const historyResponse = useSWR(`history/${id}`, () => playerHistoryFetcher(player?.id))
    const playerHistory: Historical<Player>[] = historyResponse.data ?? []

	if(!players) {
		return <AstrologyLoader />
	}
	if(!player) {
		return <AstrologyError code={404} message="Astrology was unable to find data about any such player" />
	}
    if(error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const snapshots: PlayerSnapshot[] = []
    playerHistory.forEach((data, index) => {
        const currentPlayer = data.data
        const snapshot: PlayerSnapshot = {
            id: data.id,
            date: moment(data.date).toDate(),
            changes: [],
            player: currentPlayer,
        }
        if(index === 0) {
            snapshot.changes.push("first seen")
        } else {
            const lastPlayer = snapshots[snapshots.length - 1].player
            if(currentPlayer.name !== lastPlayer.name) {
                snapshot.changes.push("name")
            }
            if(currentPlayer.team?.id !== lastPlayer.team?.id) {
                snapshot.changes.push("team")
            }
            if(currentPlayer.rosterSlots.map((slot) => `${slot.order}${slot.location}${slot.active}`).sort().join(",") 
                    !== lastPlayer.rosterSlots.map((slot) => `${slot.order}${slot.location}${slot.active}`).sort().join(",")) {
                snapshot.changes.push("location")
            }
            if(currentPlayer.positions.map((position) => position.x * 6 + position.y).sort().join(",") 
                    !== lastPlayer.positions.map((position) => position.x * 6 + position.y).sort().join(",")) {
                snapshot.changes.push("position")
            }
            if(currentPlayer.modifications.map((modification) => modification.name).sort().join(",") 
                    !== lastPlayer.modifications.map((modification) =>modification.name).sort().join(",")) {
                snapshot.changes.push("modifications")
            }
            const attributesToCheck = Array.from(new Set([...Object.keys(currentPlayer.attributes), ...Object.keys(lastPlayer.attributes)]))
            attributesToCheck.forEach((attribute) => {
                if(currentPlayer.attributes[attribute] !== lastPlayer.attributes[attribute]) {
                    snapshot.changes.push(attribute)
                }
            })
        }
        if(snapshot.changes.length > 0) {
            snapshot.changes.sort()
            snapshots.push(snapshot)
        }
    })
    
    const currentSort = sort ? sort.toString() as "asc" | "desc" : "asc"
    const sortedSnapshots = currentSort ? Array.from(snapshots).sort((snapshot1, snapshot2) => {
        let comparison: number = snapshot1.date > snapshot2.date ? -1 : 1
        if(currentSort === "asc") {
            comparison *= -1
        }
        return comparison
    }) : snapshots

    const sortSnapshots = () => {
        let newSort: "asc" | "desc";
        switch(currentSort) {
            case "asc":
                newSort = "desc"
                break;
            case "desc":
                newSort = "asc"
                break;
        }
        if(newSort) {
            router.push({
                query: {
                    id: id,
                    sort: newSort,
                }
            }, undefined, { shallow: true })
        } else {
            router.push({}, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
            <Metadata
                title={`${player.name} - Astrology`} 
                description={`Check out the historical star charts for ${player.name}.`} 
            />
            <div className="flex flex-col gap-2 p-5">
                <h1 className="text-3xl font-bold">{player.name}</h1>
                <div className="flex flex-row items-center gap-2">
                    {player.team 
                        ? <Link href={{ pathname: "/team/[id]", query: { id: player.team.id }}}><a><Emoji className="h-7 w-7 flex justify-center items-center rounded-full" style={{ backgroundColor: player.team.primaryColor }} emoji={player.team.emoji} emojiClass="h-4 w-4" /></a></Link>
                        : <Emoji 
                            emoji={"0x1F300"} 
                            emojiClass="w-4 h-4 saturate-0 brightness-200" 
                            className="h-7 w-7 flex justify-center items-center rounded-full bg-slate-700"
                        />
                    }
                    <span className="text-xl font-semibold">{player.team ? player.team.name : "Black Hole"}</span>
                </div>
                <div className="flex flex-row gap-2">
                    <span>{player.rosterSlots.length > 0? player.rosterSlots.map((slot) => (slot.active ? "" : "SHADOW ") + slot.location).join(" / ") : "SOMEWHERE"}</span>
                    <span>&mdash;</span>
                    <span>{player.positions.length > 0 ? player.positions.map((position) => position.name).join(" / ") : "Somewhere"}</span>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-row flex-grow gap-2 items-center">
                        {player.modifications.map((mod, index) =>
                            <Tooltip key={`modification_${index}`} content={mod.description ? mod.description : mod.name}>
                                <div className="px-3 py-1 border-2 rounded-md font-bold cursor-default" style={{ borderColor: mod.color, backgroundColor: mod.backgroundColor, color: mod.textColor }}>
                                    {mod.name}
                                </div>
                            </Tooltip>
                        )}
                    </div>
                    {snapshots.length > 0 && <ExportCSV data={exportPlayerHistoryData(snapshots, isItemApplied)} filename={player.id} />}
                </div>
            </div>
            <PlayerHistoryTable 
                snapshots={historyResponse.data?.length ? sortedSnapshots : undefined} 
                sort={currentSort} 
                triggerSort={sortSnapshots}
                isShowColors={isShowColors}
                isShowSimplified={isShowSimplified} 
                isItemApplied={isItemApplied} 
                scaleColors={scaleColors}
            />
            <div className="px-2 py-1 mt-4">
                <span>Don&apos;t see what you&apos;re looking for? </span> 
                <Link href={`/legacy/player/${player.id}/history`}>Maybe try the legacy version.</Link>
            </div>
        </section>
	)
}

PlayerPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}