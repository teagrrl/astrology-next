import { groupTeams } from '../models/team'
import { Fragment } from 'react'
import TeamLink from './teamlink'
import { PageProps } from '../pages/_app'

export default function Navigation({ leagueData, isDarkMode }: PageProps) {
    const { special, groups, ungrouped } = groupTeams(leagueData?.teams || [])

    return (
		<ul className="flex flex-row flex-wrap justify-center items-center gap-1">
            {special?.map((team) => 
                <li key={team.id} title={team.data.fullName}>
                    <TeamLink team={team} isDarkMode={isDarkMode} />
                </li>
            )}
            {/*<li key="nav_team_selector">
                <div>
                    <input type="search" placeholder="Select a team..." />
                    <ul>
                        {groups?.map((group) => 
                            <Fragment key={group.id}>
                                <li className="text-sm font-bold mt-1 pt-1">{group.name}</li>
                                {group.teams?.map((team) => team &&
                                    <li key={team.id} title={team.canonicalName()}>
                                        <TeamLink team={team} />
                                    </li>
                                )}
                            </Fragment>
                        )}
                        {unknown.length > 0 && <Fragment>
                            <li className="text-sm font-bold mt-1 pt-1">Others</li>
                            {unknown.map((team) =>
                                <li key={team.id} title={team.canonicalName()}>
                                    <TeamLink team={team} />
                                </li>
                            )}
                        </Fragment>}
                    </ul>
                </div>
            </li>*/}
        </ul>
    )
}