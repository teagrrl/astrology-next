import { ReactElement } from "react"
import { PageProps } from "@pages/_app"
import Layout from "@components/layout"
import Emoji from "@components/emoji"
import Link from "next/link"

type TeamsProps = PageProps & {}

export default function TeamsPage({ teams, players }: TeamsProps) {
    console.log(players)
    return (
        <div className="overflow-auto">
            {teams && teams.length > 0 && <table className="table-auto">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Division</th>
                        <th>Emoji</th>
                        <th>Shorthand</th>
                        <th>Name</th>
                        <th>Slogan</th>
                        <th>Batting</th>
                        <th>Pitching</th>
                        <th>Defense</th>
                        <th>Running</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team) => <tr key={team.id}>
                        <td>{team.id}</td>
                        <td></td>
                        <td><Emoji emoji={team.emoji} /></td>
                        <td>{team.shorthand}</td>
                        <td><Link href={`team/${team.id}`}>{team.name}</Link></td>
                        <td>{team.slogan}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>)}
                </tbody>
            </table>}
            <div className="px-2 py-1 mt-4">
                <span>Don&apos;t see what you&apos;re looking for? </span> 
                <Link href="/legacy/teams">Maybe try the legacy version.</Link>
            </div>
        </div>
    )
}

TeamsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout {...props}>
			{page}
		</Layout>
	)
}