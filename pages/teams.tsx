import { ReactElement } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { getReverseAttributes, teamColumns } from "@models/columns2"
import { TeamComparator } from "@models/team2"
import { PageProps } from "@pages/_app"
import Layout from "@components/layout"
import AstrologyLoader from "@components/loader"
import AstrologyError from "@components/error"
import Emoji from "@components/emoji"
import TeamTable from "@components/teamtable"
import ExportCSV, { exportTeamData } from "@components/exportcsv"

type TeamsProps = PageProps & {}

const reverseAttributes = getReverseAttributes(teamColumns)

export default function TeamsPage({ teams, error, isShowColors, isItemApplied, isShowSimplified, scaleColors }: TeamsProps) {
    const router = useRouter()
    const { sort, direction } = router.query

	if(!teams) {
		return <AstrologyLoader />
	}
    if(error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${error}`} />
    }

    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "asc"
    
    const sortedTeams = teams.filter((team) => team.active).sort(TeamComparator(currentSort, currentDirection, isItemApplied))

    const sortTeams = (newSort: string) => {
        let newDirection: "asc" | "desc" | null = null;
        if(newSort === currentSort) {
            switch(currentDirection) {
                case "asc":
                    newDirection = reverseAttributes.includes(newSort) ? "desc" : null
                    break;
                case "desc":
                    newDirection = reverseAttributes.includes(newSort) ? null : "asc"
                    break;
            }
        } else {
            newDirection = reverseAttributes.includes(newSort) ? "asc" : "desc"
        }
        const routerQuery: Record<string, string | string[]> = {}
        if(newDirection) {
            routerQuery["sort"] = newSort
            routerQuery["direction"] = newDirection
        } 
        router.push({
            query: routerQuery
        }, undefined, { shallow: true })
    }

    return (
        <div className="overflow-auto">
            <div className="flex justify-center items-center text-center p-5 gap-2">
                <Emoji className="h-14 w-14 flex justify-center items-center rounded-full" style={{ backgroundColor: "#8f3232" }} emoji={"0x1FA78"} emojiClass="h-8 w-8" />
                <div>
                    <div className="text-3xl font-bold">
                        <span>The Teams</span>
                    </div>
                    <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">Play Ball!</div>
                </div>
            </div>
            <div className="flex flex-row justify-end p-2">
                <ExportCSV data={exportTeamData(sortedTeams, isItemApplied)} filename={"teams"} />
            </div>
            {teams && teams.length > 0 && <TeamTable 
                teams={sortedTeams}
                sort={currentSort}
                direction={currentDirection}
                triggerSort={sortTeams}
                isShowColors={isShowColors}
                isItemApplied={isItemApplied}
                isShowSimplified={isShowSimplified} 
                scaleColors={scaleColors}
            />}
            <div className="px-2 py-1 mt-4">
                <div>
                    <span>Don&apos;t see what you&apos;re looking for? </span> 
                    <Link href={`/legacy/teams`}><a className="py-0.5 rounded-md transition-all hover:px-1.5 hover:font-semibold hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white">Try the legacy version.</a></Link>
                </div>
            </div>
        </div>
    )
}

TeamsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Teams - Astrology" 
            description="Compare the Star Charts and hidden attributes of The Teams of Blaseball."
            hasFooter={true} 
            {...props}
        >
			{page}
		</Layout>
	)
}