import type { ReactElement } from 'react'
import Layout from '../components/layout'
import TeamLink from '../components/teamlink'
import { groupTeams } from '../models/team'
import { useChroniclerToFetchTeams } from '../useChronicler'
import { PageProps } from './_app'

export default function TeamsPage({ isDarkMode }: PageProps) {
    const teams = useChroniclerToFetchTeams()
    const { groups } = groupTeams(teams)
	
	return (
        <section className="overflow-auto">
            <h1 className="mt-5 text-5xl text-center font-bold">Choose a team to begin.</h1>
			{groups?.map((group) => 
                <div className="p-5 odd:bg-gray-200 dark:odd:bg-gray-800" key={group.id}>
                    <h2 className="mb-5 text-3xl text-center font-bold">{group.name}</h2>
                    <ul className="flex flex-row flex-wrap justify-center items-center gap-1">
                        {group.teams?.map((team) =>  
                            <TeamLink key={team.id} team={team} useFullName={true} isDarkMode={isDarkMode} />
                        )}
                    </ul>
                </div>
            )}
        </section>
	)
}

TeamsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout {...props}>
			{page}
		</Layout>
	)
}