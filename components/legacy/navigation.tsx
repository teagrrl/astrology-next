import { groupTeams } from '@models/team'
import TeamLink from '@components/legacy/teamlink'
import { PageProps } from '@pages/_app'

export default function Navigation({ leagueData, isDarkMode }: PageProps) {
    const { special } = groupTeams(leagueData?.teams || [])

    return (
        <nav className="min-h-[2.75em] m-1 overflow-auto md:min-h-[auto] md:overflow-visible">
            <ul className="flex flex-row md:justify-center items-center gap-1 md:flex-wrap">
                {special?.map((team) => 
                    <li key={team.id} title={team.data.fullName}>
                        <TeamLink team={team} isDarkMode={isDarkMode} />
                    </li>
                )}
            </ul>
        </nav>
    )
}