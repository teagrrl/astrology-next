import React, { ReactElement } from 'react'
import Link from 'next/link'
import { TeamGroups } from '@models/api2'
import Team from '@models/team2'
import Layout from '@components/layout'
import AstrologyLoader from '@components/loader'
import AstrologyError from '@components/error'
import Emoji from '@components/emoji'
import { PageProps } from '@pages/_app'

export default function TeamsPage({ teams, error, isDarkMode }: PageProps) {
	if(!teams) {
		return <AstrologyLoader />
	}
    if(error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const nonEmptyTeams = teams.filter((team) => team.totalPlayers > 0)
    const groups = TeamGroups.map((group) => {
            const foundTeams = group.teams.map((id) => nonEmptyTeams.find((team) => team.id === id)).filter((team): team is Team => team !== undefined)
            return {
                id: group.id,
                name: group.name,
                teams: foundTeams.sort(shorthandComparator),
            }
        })
        .filter((group) => group.teams.length)
    const ungroups = nonEmptyTeams.filter((team) => !groups.map((group) => group.teams).flat().map((team) => team.id).includes(team.id))
	
	return (
        <section className="overflow-auto">
            <div className="flex justify-center items-center text-center p-5 gap-2">
                <Emoji className="h-14 w-14 flex justify-center items-center rounded-full" style={{ backgroundColor: "#885a84" }} emoji={"0x1F4DA"} emojiClass="h-8 w-8" />
                <div>
                    <div className="text-3xl font-bold">
                        <span>The Annex</span>
                    </div>
                    <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">Auxilary Lōotcrates storage.</div>
                </div>
            </div>
            {groups.map((group) => 
                <div key={group.id} className="p-5 odd:bg-zinc-100 dark:odd:bg-zinc-800">
                    <h2 className="flex justify-center items-center mb-5 text-3xl text-center font-bold">{group.name}</h2>
                    <ul className="flex flex-row flex-wrap justify-center items-center gap-1">
                        {group.teams?.map((team) =>  
                            <Link key={team.id} href={`/team/${team.id}`}>
                                <a className="flex items-center px-1.5 py-1 rounded-md font-semibold transition hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:text-black">
                                    <Emoji className="h-7 w-7 flex justify-center items-center rounded-full" style={{ backgroundColor: team.primaryColor }} emoji={team.emoji} emojiClass="h-4 w-4" />
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-md whitespace-nowrap" style={isDarkMode ? { color: team.secondaryColor } : { backgroundColor: team.secondaryColor }}>{team.name}</span>
                                </a>
                            </Link>
                        )}
                    </ul>
                </div>
            )}
            {<div className="p-5 odd:bg-zinc-100 dark:odd:bg-zinc-800">
                <h2 className="flex justify-center items-center mb-5 text-3xl text-center font-bold">Others</h2>
                <ul className="flex flex-row flex-wrap justify-center items-center gap-1">
                    {ungroups.map((team) => 
                        <Link key={team.id} href={`/team/${team.id}`}>
                            <a className="flex items-center px-1.5 py-1 rounded-md font-semibold transition hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:text-black">
                                <Emoji className="h-7 w-7 flex justify-center items-center rounded-full" style={{ backgroundColor: team.primaryColor }} emoji={team.emoji} emojiClass="h-4 w-4" />
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-md whitespace-nowrap" style={isDarkMode ? { color: team.secondaryColor } : { backgroundColor: team.secondaryColor }}>{team.name}</span>
                            </a>
                        </Link>
                    )}
                </ul>
            </div>}
        </section>
	)
}

TeamsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Annex - Astrology" 
            description="The Teams of Blaseball past, present, and future."
            {...props}
        >
			{page}
		</Layout>
	)
}

function shorthandComparator(team1: Team, team2: Team) {
    return team1.shorthand.localeCompare(team2.shorthand)
}