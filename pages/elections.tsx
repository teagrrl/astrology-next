import React, { ReactElement } from "react"
import Link from "next/link"
import useSWR from "swr"
import { PageProps } from "@pages/_app"
import Team from "@models/team2"
import Layout from "@components/layout"
import Emoji from "@components/emoji"

type ElectionsPageProps = PageProps & {

}

interface ChroniclerData<T> {
    kind: string,
    entity_id: string,
    valid_from: string,
    valid_to: string | null,
    data: T,
}

interface SeasonElection {
    blessings: ElectionGroup[],
    decrees: ElectionGroup[],
}

interface ElectionGroup {
    choiceType: string,
    description: string,
    electionComplete: boolean,
    electionOptions: ElectionOption[],
    endTimestamp: number,
    id: string,
    maximumAllowed: number,
    name: string,
    seasonId: string,
    startTimestamp: number,
}

interface ElectionOption {
    description: string,
    electionGroupId: string,
    id: string,
    name: string,
    results: ElectionResult[],
    subheading: string,
    tags: string[],
}

interface ElectionResult {
    outcomeStrings: string[],
    overallVoteCount: number,
    resultType: string,
    topVoteCount: number,
    topVotedTeam: ElectionTeam,
    winningTeam: ElectionTeam,
    winningVoteCount: number,
}

interface ElectionTeam {
    emoji: string,
    id: string,
    name: string,
    nickname: string,
    primaryColor: string,
    secondaryColor: string,
    shorthand: string,
    slogan: string,
}

interface ElectionPreferences {
    groups: ElectionPreferenceGroup[],
    team_id: string,
}

interface ElectionPreferenceGroup {
    id: string,
    top_option_ids: string[],
}

export default function ElectionsPage({ teams }: ElectionsPageProps) {
    const elections = useSWR<{ items: ChroniclerData<SeasonElection>[] }>("https://api2.sibr.dev/chronicler/v0/entities?kind=season_elections", fetcher)
    const preferences = useSWR<{ items: ChroniclerData<ElectionPreferences>[] }>("https://api2.sibr.dev/chronicler/v0/entities?kind=team_blessing_preferences", fetcher)
    
    const electionData = (elections.data?.items ?? [])
    const preferenceData = (preferences.data?.items ?? []).map((wrapper) => wrapper.data)

    const data = electionData.map((wrapper) => {
        return {
            season_id: wrapper.entity_id,
            decrees: wrapper.data.decrees.map((decree) => {
                return {
                    id: decree.id,
                    name: decree.name,
                    description: decree.description,
                    complete: decree.electionComplete,
                    options: decree.electionOptions.filter((option) => decree.electionComplete && option.results.filter((result) => result.overallVoteCount > 0).length > 0).map((option) => {
                        return {
                            id: option.id,
                            name: option.name,
                            description: option.description,
                            subheading: option.subheading,
                            results: option.results,
                        }
                    })
                }
            }),
            blessings: wrapper.data.blessings.map((blessing) => {
                return {
                    id: blessing.id,
                    name: blessing.name,
                    description: blessing.description,
                    options: blessing.electionOptions.map((option) => {
                        return {
                            id: option.id,
                            name: option.name,
                            description: option.description,
                            subheading: option.subheading,
                            results: option.results,
                            teams: preferenceData.filter((pref) => 
                                pref.groups.filter((group) => group.id === option.electionGroupId)
                                    .filter((group) => group.top_option_ids.includes(option.id)).length > 0
                            ).map((pref) => teams?.find((team) => team.id === pref.team_id)).filter((team): team is Team => team !== undefined),
                        }
                    }),
                }
            }),
        }
    }).reverse()

	return (
        <section className="overflow-auto">
            <div className="flex flex-col gap-4 pb-8">
                {data.map((election, index) =>
                    <div key={election.season_id} className="flex flex-col gap-2 p-2">
                        <h1 className="font-bold text-4xl text-center">Season {data.length - index}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-center">
                            {election.decrees.map((decree) =>
                                decree.options.map((option) =>
                                    <div key={option.id} className="flex flex-col md:col-span-2 lg:col-span-3 p-2 rounded-lg h-fit bg-zinc-300 dark:bg-zinc-800">
                                        <div className="flex flex-row font-bold text-xl">
                                            <span className="flex-grow">{option.name}</span>
                                            {option.results.length > 0 && <span>
                                                {option.results.reduce((total, result) => total + result.overallVoteCount, 0).toLocaleString()} Votes Cast
                                            </span>}
                                        </div>
                                        {option.results.length > 0 
                                            ? <div className="border-t-2 mt-2 pt-2">
                                                {option.results.map((result, index) => 
                                                    <div key={`result_${index}`}>
                                                        <div className="col-span-5 border-l-2 pl-2 ml-2">
                                                            {result.outcomeStrings.map((str, index) => <p key={`outcome_${index}`}>{str}</p>)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div> 
                                            : <>
                                                <span>{option.description}</span>
                                                <span>{option.subheading}</span>
                                            </>
                                        }
                                    </div>
                                )
                            )}
                            {election.blessings.map((blessing) =>
                                blessing.options.map((option) =>
                                    <div key={option.id} className="flex flex-col p-2 rounded-lg h-fit bg-zinc-300 dark:bg-zinc-800">
                                        <div className="flex flex-row font-bold text-xl">
                                            <span className="flex-grow">{option.name}</span>
                                            {option.results.length > 0 && <span>
                                                {option.results.reduce((total, result) => total + result.overallVoteCount, 0).toLocaleString()} Votes Cast
                                            </span>}
                                        </div>
                                        <div className="border-t-2 mt-2 pt-2">
                                            {option.results.length > 0 
                                                ? option.results.map((result, index) => 
                                                    <div key={`result_${index}`} className="flex flex-col gap-2">
                                                        <div className="flex flex-row flex-wrap items-center gap-x-2">
                                                            <span className="font-bold col-span-1">Most Votes: </span>
                                                            <Link href={`/team/${result.topVotedTeam.id}`}>
                                                                <a style={{ color: result.topVotedTeam.secondaryColor }} className="flex flex-row items-center gap-1 col-span-2">
                                                                    <Emoji 
                                                                        emoji={result.topVotedTeam.emoji} 
                                                                        emojiClass="w-4 h-4" 
                                                                        className="h-7 w-7 flex justify-center items-center rounded-full"
                                                                        style={{ backgroundColor: result.topVotedTeam.primaryColor }}
                                                                    />
                                                                    <span className="font-semibold whitespace-nowrap">{result.topVotedTeam.name}</span>
                                                                </a>
                                                            </Link>
                                                            <span className="col-span-2">{result.topVoteCount.toLocaleString()} votes ({Math.round(result.topVoteCount / result.overallVoteCount * 10000) / 100}% of total)</span>
                                                        </div>
                                                        <div className="flex flex-row flex-wrap items-center gap-x-2">
                                                            <span className="font-bold col-span-1">Winner: </span>
                                                            <Link href={`/team/${result.winningTeam.id}`}>
                                                                <a className="flex flex-row items-center gap-1 col-span-2" style={{ color: result.winningTeam.secondaryColor }}>
                                                                    <Emoji 
                                                                        emoji={result.winningTeam.emoji} 
                                                                        emojiClass="w-4 h-4" 
                                                                        className="h-7 w-7 flex justify-center items-center rounded-full"
                                                                        style={{ backgroundColor: result.winningTeam.primaryColor }}
                                                                    />
                                                                    <span className="font-semibold whitespace-nowrap">{result.winningTeam.name}</span>
                                                                </a>
                                                            </Link>
                                                            <span className="col-span-2">{result.winningVoteCount.toLocaleString()} votes ({Math.round(result.winningVoteCount / result.overallVoteCount * 10000) / 100}% of total)</span>
                                                        </div>
                                                        <div className="col-span-5 border-l-2 pl-2 ml-2">
                                                            {result.outcomeStrings.map((str, index) => <p key={`outcome_${index}`}>{str}</p>)}
                                                        </div>
                                                    </div>
                                                )
                                                : <div className="flex flex-col">
                                                    <span>{option.description}</span>
                                                    <h4 className="font-semibold text-lg">There are {option.teams.length} interested parties...</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {option.teams.map((team) => 
                                                            <div key={team.id} className="w-fit">
                                                                <Link href={`/team/${team.id}`}>
                                                                    <a className="flex flex-row items-center gap-1 col-span-2" style={{ color: team.secondaryColor }}>
                                                                        <Emoji 
                                                                            emoji={team.emoji} 
                                                                            emojiClass="w-4 h-4" 
                                                                            className="h-7 w-7 flex justify-center items-center rounded-full"
                                                                            style={{ backgroundColor: team.primaryColor }}
                                                                        />
                                                                        <span className="font-semibold whitespace-nowrap">{team.name}</span>
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
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