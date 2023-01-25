import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { PageProps } from '@pages/_app'
import Layout from '@components/layout'
import AstrologyLoader from '@components/loader'
import AstrologyError from '@components/error'
import Metadata from '@components/metadata'
import Link from 'next/link'
import TeamHeader from '@components/teamheader'
import Tooltip from '@components/tooltip'
import { BlaseballPlayer, Historical, teamHistoryFetcher } from '@models/api2'
import useSWR from 'swr'
import Team, { TeamSnapshot } from '@models/team2'
import moment from 'moment'
import Emoji from '@components/emoji'

type TeamHistoryPageProps = PageProps & {}

export default function TeamHistoryPage({ teams, error }: TeamHistoryPageProps) {
    const router = useRouter()
    const { id } = router.query
	const team = teams?.find((team) => team.id === id)
    const historyResponse = useSWR(`history/${id}`, () => teamHistoryFetcher(team?.id))
    const teamHistory: Historical<Team>[] = historyResponse.data ?? []

	if(!teams) {
		return <AstrologyLoader />
	}
	if(!team) {
		return <AstrologyError code={404} message="Astrology was unable to find data about any such team" />
	}
    if(error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const snapshots: TeamSnapshot[] = []
    teamHistory.forEach((data, index) => {
        const currentTeam = data.data
        const lineup: Record<number, BlaseballPlayer> = {}
        const rotation: Record<number, BlaseballPlayer> = {}
        const shadows: Record<number, BlaseballPlayer> = {}
        for(const player of data.roster ?? []) {
            for(const slot of player.rosterSlots) {
                switch(slot.location) {
                    case "LINEUP":
                        lineup[slot.orderIndex] = player
                        break
                    case "ROTATION":
                        rotation[slot.orderIndex] = player
                        break
                    case "SHADOWS":
                        shadows[slot.orderIndex] = player
                        break
                }
            }
        }
        const snapshot: TeamSnapshot = {
            id: data.id,
            date: moment(data.date).toDate(),
            changes: [],
            team: currentTeam,
            lineup: Object.values(lineup),
            rotation: Object.values(rotation),
            shadows: Object.values(shadows),
        }
        if(index === 0) {
            snapshot.changes.push("first seen")
        } else {
            const lastSnapshot = snapshots[snapshots.length - 1]
            if(currentTeam.emoji !== lastSnapshot.team.emoji) {
                snapshot.changes.push("emoji")
            }
            if(currentTeam.name !== lastSnapshot.team.name) {
                snapshot.changes.push("name")
            }
            if(currentTeam.location !== lastSnapshot.team.location) {
                snapshot.changes.push("location")
            }
            if(currentTeam.nickname !== lastSnapshot.team.nickname) {
                snapshot.changes.push("nickname")
            }
            if(currentTeam.shorthand !== lastSnapshot.team.shorthand) {
                snapshot.changes.push("shorthand")
            }
            if(currentTeam.slogan !== lastSnapshot.team.slogan) {
                snapshot.changes.push("slogan")
            }
            if(currentTeam.primaryColor !== lastSnapshot.team.primaryColor) {
                snapshot.changes.push("primaryColor")
            }
            if(currentTeam.secondaryColor !== lastSnapshot.team.secondaryColor) {
                snapshot.changes.push("secondaryColor")
            }
            if(currentTeam.modifications.map((modification) => modification.name).sort().join(",") 
                    !== lastSnapshot.team.modifications.map((modification) =>modification.name).sort().join(",")) {
                snapshot.changes.push("modifications")
            }
            if(currentTeam.division !== lastSnapshot.team.division) {
                snapshot.changes.push("division")
            }
            if(currentTeam.standings.map((standings) => standings.season).sort().join(",") 
                    !== lastSnapshot.team.standings.map((standings) => standings.season).sort().join(",") ) {
                snapshot.changes.push("season")
            }
            if(snapshot.lineup.map((player) => player.id + player.overallRating).join(",") !== lastSnapshot.lineup.map((player) => player.id + player.overallRating).join(",")) {
                snapshot.changes.push("lineup")
            }
            if(snapshot.rotation.map((player) => player.id + player.overallRating).join(",") !== lastSnapshot.rotation.map((player) => player.id + player.overallRating).join(",")) {
                snapshot.changes.push("rotation")
            }
            /*if(snapshot.shadows.map((player) => player.id + player.overallRating).join(",") !== lastSnapshot.shadows.map((player) => player.id + player.overallRating).join(",")) {
                snapshot.changes.push("shadows")
            }*/
            /*const attributesToCheck = Array.from(new Set([...Object.keys(currentTeam.stars), ...Object.keys(lastSnapshot.team.stars)]))
            attributesToCheck.forEach((attribute) => {
                if(currentTeam.stars[attribute] !== lastSnapshot.team.stars[attribute]) {
                    snapshot.changes.push(attribute)
                }
            })*/
        }
        if(snapshot.changes.length > 0) {
            snapshot.changes.sort()
            snapshots.push(snapshot)
        }
    })
	
	return (
        <section className="overflow-auto">
			<Metadata
				title={`${team.name} - Astrology`} 
				description={`Read the historical Star Charts for the ${team.name}.`} 
			/>
            <TeamHeader team={team} />
            <div className="flex flex-row p-2 gap-2">
                <div className="flex flex-row flex-grow gap-2 items-center">
                    {team.modifications.map((mod, index) =>
                        <Tooltip key={`modification_${index}`} content={mod.description ? mod.description : mod.name}>
                            <div className="px-3 py-1 border-2 rounded-md font-bold cursor-default" style={{ borderColor: mod.color, backgroundColor: mod.backgroundColor, color: mod.textColor }}>
                                {mod.name}
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div className="overflow-auto m-2 mb-10">
                {historyResponse.data && historyResponse.data.length
                    ? <div className="flex flex-row flex-nowrap gap-4 pb-2">
                        {snapshots.map((snapshot) => 
                            <div key={snapshot.id} className="flex flex-col border-2 h-fit">
                                <div className="p-2 border-b-2 whitespace-nowrap">
                                    <span className="font-semibold">Observed: </span>{snapshot.date.toLocaleDateString()} {snapshot.date.toLocaleTimeString()}
                                </div>
                                <div className="p-2 border-b-2">
                                    <span className="font-semibold">Changes: </span>{snapshot.changes.join(", ")}
                                </div>
                                <div className="flex flex-row gap-2 p-2 justify-center">
                                    <Emoji className="h-14 w-14 flex justify-center items-center rounded-full" style={{ backgroundColor: snapshot.team.primaryColor }} emoji={snapshot.team.emoji} emojiClass="h-8 w-8" />
                                    <div className="flex flex-col text-center">
                                        <h2 className="text-3xl font-bold whitespace-nowrap">{snapshot.team.name}</h2>
                                        <h4 className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{snapshot.team.slogan}</h4>
                                    </div>
                                </div>
                                <div className="flex flex-row flex-grow gap-2 p-2 border-b-2 items-center">
                                    {snapshot.team.modifications.map((mod, index) =>
                                        <Tooltip key={`modification_${index}`} content={mod.description ? mod.description : mod.name}>
                                            <div className="px-3 py-1 border-2 rounded-md font-bold cursor-default" style={{ borderColor: mod.color, backgroundColor: mod.backgroundColor, color: mod.textColor }}>
                                                {mod.name}
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                                <div className="flex flex-row gap-2 p-2 border-b-2 whitespace-nowrap">
                                    <div className="flex-grow"><span className="font-semibold">Division: </span>{snapshot.team.division}</div>
                                    <div><span className="font-semibold">Record: </span>{snapshot.team.wins} - {snapshot.team.losses}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-1 p-2 border-b-2 text-center">
                                    <span className="font-semibold">Batting</span>
                                    <span className="font-semibold">Pitching</span>
                                    <span className="font-semibold">Defense</span>
                                    <span className="font-semibold">Running</span>
                                    <span>{Math.round(snapshot.team.stars["batting"] * 5000) / 1000}</span>
                                    <span>{Math.round(snapshot.team.stars["pitching"] * 5000) / 1000}</span>
                                    <span>{Math.round(snapshot.team.stars["defense"] * 5000) / 1000}</span>
                                    <span>{Math.round(snapshot.team.stars["running"] * 5000) / 1000}</span>
                                </div>
                                <div className="flex flex-col p-2 border-b-2">
                                    <div className="flex flex-row font-bold text-lg">
                                        <h3>LINEUP</h3>
                                        <span className="flex-grow text-right">Overall</span>
                                    </div>
                                    {snapshot.lineup.map((player) => 
                                        <div key={player.id} className="flex flex-row">
                                            <Link href={`/player/${player.id}`}><a className="font-semibold">{player.name}</a></Link>
                                            <span className="flex-grow text-right">{player.overallRating}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col p-2 border-b-2">
                                    <div className="flex flex-row font-bold text-lg">
                                        <h3>ROTATION</h3>
                                        <span className="flex-grow text-right">Overall</span>
                                    </div>
                                    {snapshot.rotation.map((player) => 
                                        <div key={player.id} className="flex flex-row">
                                            <Link href={`/player/${player.id}`}><a className="font-semibold">{player.name}</a></Link>
                                            <span className="flex-grow text-right">{player.overallRating}</span>
                                        </div>
                                    )}
                                </div>
                                {/*snapshot.shadows.length > 0 && <div className="flex flex-col p-2 border-b-2">
                                    <div className="flex flex-row font-bold text-lg">
                                        <h3>SHADOWS</h3>
                                        <span className="flex-grow text-right">Overall</span>
                                    </div>
                                    {snapshot.shadows.map((player) => 
                                        <div key={player.id} className="flex flex-row">
                                            <Link href={`/player/${player.id}`}><a className="font-semibold">{player.name}</a></Link>
                                            <span className="flex-grow text-right">{player.overallRating}</span>
                                        </div>
                                    )}
                                </div>*/}
                            </div>
                        )}
                    </div>
                : <AstrologyLoader />}
            </div>
		</section>
	)
}

TeamHistoryPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}