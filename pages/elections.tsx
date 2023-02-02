/* eslint-disable @next/next/no-img-element */
import React, { ReactElement } from "react"
import Link from "next/link"
import useSWR from "swr"
import { PageProps } from "@pages/_app"
import { electionFetcher } from "@models/api2"
import Team from "@models/team2"
import Layout from "@components/layout"
import Emoji from "@components/emoji"
import AstrologyError from "@components/error"

type ElectionsPageProps = PageProps & {

}

export default function ElectionsPage({ teams, isDarkMode }: ElectionsPageProps) {
    const { data, error } = useSWR("elections", electionFetcher)

    if(error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }
    
    const elections = Array.from(data?.elections ?? []).reverse()
    const preferences: Record<string, Team[]> = {}
    if(data?.preferences) {
        for(const [optionId, teamIds] of Object.entries(data.preferences)) {
            preferences[optionId] = []
            teamIds.forEach((teamId) => {
                if(!data?.mentioned[optionId].includes(teamId)) {
                    const foundTeam = teams?.find((team) => team.id === teamId)
                    if(foundTeam) preferences[optionId].push(foundTeam)
                }
            })
        }
    }

	return (
        <section className="overflow-auto">
            <div className="flex flex-col gap-4 pb-8">
                {elections.map((election) =>
                    <div key={election.id} className="flex flex-col gap-2 p-2">
                        <h1 className="font-bold text-4xl text-center">Season {election.number}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-center">
                            {election.decrees.map((decree) =>
                                decree.options.map((option) =>
                                    <div key={option.id} className={`flex flex-col ${decree.complete ? "md:col-span-2 lg:col-span-3" : ""} p-2 rounded-lg h-fit bg-zinc-100 dark:bg-zinc-800`}>
                                        <div className="flex flex-row gap-2 items-center text-xl">
                                            {decree.complete && <span className="text-base">It has been decided </span>} 
                                            <span className="flex-grow font-bold">{option.name}</span>
                                            {option.results.length > 0 && <span className="font-bold">
                                                {option.results.reduce((total, result) => total + result.votes, 0).toLocaleString()} Votes Cast
                                            </span>}
                                        </div>
                                        <div className="flex flex-col text-center items-center gap-2 border-t-2 mt-2 pt-2">
                                            {option.icon.length > 0 && <div className="w-32 h-32"><img src={option.icon} alt={option.name} /></div>}
                                            {option.results.length > 0 
                                                ? option.results.map((result) => result.outcomes.map((str, index) => <p key={`outcome_${index}`}>{str}</p>))
                                                : <>
                                                    <span>{option.description}</span>
                                                    <span>{option.subheading}</span>
                                                </>
                                            }
                                        </div>
                                    </div>
                                )
                            )}
                            {election.blessings.map((blessing) =>
                                blessing.options.map((option) =>
                                    <div key={option.id} className="flex flex-col p-2 rounded-lg h-fit bg-zinc-100 dark:bg-zinc-800">
                                        <div className="flex flex-row font-bold text-xl">
                                            <span className="flex-grow">{option.name}</span>
                                            {option.results.length > 0 && <span>
                                                {option.results.reduce((total, result) => total + result.votes, 0).toLocaleString()} Votes Cast
                                            </span>}
                                        </div>
                                        <div className="border-t-2 mt-2 pt-2">
                                            {option.results.length > 0 
                                                ? option.results.map((result, index) => 
                                                    <div key={`result_${index}`} className="flex flex-col gap-2">
                                                        <div className="flex flex-row flex-wrap items-center gap-x-2">
                                                            <span className="font-bold">Most Votes: </span>
                                                            <Link href={`/team/${result.topVoted.team.id}`}>
                                                                <a className="flex flex-row items-center gap-1">
                                                                    <Emoji 
                                                                        emoji={result.topVoted.team.emoji} 
                                                                        emojiClass="w-4 h-4" 
                                                                        className="h-7 w-7 flex justify-center items-center rounded-full"
                                                                        style={{ backgroundColor: result.topVoted.team.primaryColor }}
                                                                    />
                                                                    <span className="px-1 py-0.5 rounded-md font-semibold whitespace-nowrap" style={ isDarkMode ? { color: result.topVoted.team.secondaryColor } : { backgroundColor: result.topVoted.team.secondaryColor} }>{result.topVoted.team.name}</span>
                                                                </a>
                                                            </Link>
                                                            <span>{result.topVoted.votes.toLocaleString()} votes ({Math.round(result.topVoted.votes / result.votes * 10000) / 100}% of total)</span>
                                                        </div>
                                                        <div className="flex flex-row flex-wrap items-center gap-x-2">
                                                            <span className="font-bold">Winner: </span>
                                                            <Link href={`/team/${result.winner.team.id}`}>
                                                                <a className="flex flex-row items-center gap-1">
                                                                    <Emoji 
                                                                        emoji={result.winner.team.emoji} 
                                                                        emojiClass="w-4 h-4" 
                                                                        className="h-7 w-7 flex justify-center items-center rounded-full"
                                                                        style={{ backgroundColor: result.winner.team.primaryColor }}
                                                                    />
                                                                    <span className="px-1 py-0.5 rounded-md font-semibold whitespace-nowrap" style={ isDarkMode ? { color: result.winner.team.secondaryColor } : { backgroundColor: result.winner.team.secondaryColor }}>{result.winner.team.name}</span>
                                                                </a>
                                                            </Link>
                                                            <span>{result.winner.votes.toLocaleString()} votes ({Math.round(result.winner.votes / result.votes * 10000) / 100}% of total)</span>
                                                        </div>
                                                        <div className="border-l-2 pl-2 ml-2">
                                                            {result.outcomes.map((str, index) => <p key={`outcome_${index}`}>{str}</p>)}
                                                        </div>
                                                        {preferences[option.id] && preferences[option.id].length > 0 && <div className="flex flex-row flex-wrap gap-1 items-center">
                                                            <span className="font-semibold">The {preferences[option.id].length === 1 ? "other" : preferences[option.id].length} known interested part{preferences[option.id].length === 1 ? "y" : "ies"}: </span>
                                                            {preferences[option.id].map((team) => 
                                                                <div key={team.id} className="w-fit">
                                                                    <Link href={`/team/${team.id}`}>
                                                                        <a className="px-1 py-0.5 rounded-md font-semibold whitespace-nowrap" style={ isDarkMode ? { color: team.secondaryColor } : { backgroundColor: team.secondaryColor } }>{team.shorthand}</a>
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>}
                                                    </div>
                                                )
                                                : <div className="flex flex-col">
                                                    <span>{option.description}</span>
                                                    {preferences[option.id] && preferences[option.id].length > 0 ? <>
                                                        <h4 className="font-semibold text-lg">There {preferences[option.id].length === 1 ? "is" : "are"} {preferences[option.id].length} interested part{preferences[option.id].length === 1 ? "y" : "ies"}...</h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {preferences[option.id].map((team) => 
                                                                <div key={team.id} className="w-fit">
                                                                    <Link href={`/team/${team.id}`}>
                                                                        <a className="flex flex-row items-center gap-1">
                                                                            <Emoji 
                                                                                emoji={team.emoji} 
                                                                                emojiClass="w-4 h-4" 
                                                                                className="h-7 w-7 flex justify-center items-center rounded-full"
                                                                                style={{ backgroundColor: team.primaryColor }}
                                                                            />
                                                                            <span className="px-1 py-0.5 rounded-md font-semibold whitespace-nowrap" style={ isDarkMode ? { color: team.secondaryColor } : { backgroundColor: team.secondaryColor } }>{team.name}</span>
                                                                        </a>
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                    : <span className="font-semibold text-lg">No teams are favoring this blessing...</span>}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
	)
}

async function fetcher<T>(url: string): Promise<T> {
    const response = await fetch(url, { mode: "cors" })

    return (await response.json()) as T
}

ElectionsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}