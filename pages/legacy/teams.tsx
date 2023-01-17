import Link from 'next/link'
import type { ReactElement } from 'react'
import Emoji from '@components/emoji'
import AstrologyError from '@components/error'
import Layout from '@components/legacy/layout'
import AstrologyLoader from '@components/loader'
import TeamHeader from '@components/legacy/teamheader'
import TeamLink from '@components/legacy/teamlink'
import { AllTeams, groupTeams } from '@models/team'
import { PageProps } from '@pages/_app'

export default function TeamsPage({ leagueData, isDarkMode }: PageProps) {
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    const { groups, ungrouped } = groupTeams(leagueData.teams || [])
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={AllTeams} />
            {groups?.map((group) => 
                <div key={group.id} className="p-5 odd:bg-zinc-100 dark:odd:bg-zinc-800">
                    <h2 className="flex justify-center items-center mb-5 text-3xl text-center font-bold">
                        <span>{group.name}</span>
                        <Link href={{
                            pathname: "/legacy/squeezer/[groupId]",
                            query: {
                                groupId: group.id,
                            },
                        }}>
                            <a className="ml-2" title={`${group.name} Stat Squeezer`}><Emoji emoji="0x1F9EE" emojiClass="w-6 h-6 " /></a>
                        </Link>
                    </h2>
                    <ul className="flex flex-row flex-wrap justify-center items-center gap-1">
                        {group.teams?.map((team) =>  
                            <TeamLink key={team.id} team={team} useFullName={true} isDarkMode={isDarkMode} />
                        )}
                    </ul>
                </div>
            )}
            <div className="p-5 odd:bg-zinc-100 dark:odd:bg-zinc-800">
                <h2 className="flex justify-center items-center mb-5 text-3xl text-center font-bold">Others</h2>
                <ul className="flex flex-row flex-wrap justify-center items-center gap-1">
                    {ungrouped?.map((team) => 
                        <TeamLink key={team.id} team={team} useFullName={true} isDarkMode={isDarkMode} />
                    )}
                </ul>
            </div>
        </section>
	)
}

TeamsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Teams - Astrology" 
            description="Choose a team to begin navigating their star charts."
            {...props}
        >
			{page}
		</Layout>
	)
}