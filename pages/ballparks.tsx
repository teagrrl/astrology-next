import getConfig from "next/config";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import BallparkTable from "../components/ballparktable";
import AstrologyError from "../components/error";
import { exportBallparkData } from "../components/exportcsv";
import Layout from "../components/layout";
import AstrologyLoader from "../components/loader";
import Pagination from "../components/pagination";
import TeamHeader from "../components/teamheader";
import { BallparkComparator, reverseBallparkAttributes } from "../models/ballpark";
import { AllBallparks } from "../models/team";
import { useChroniclerToFetchBallparks } from "./api/chronicler";
import { PageProps } from "./_app";

const { publicRuntimeConfig } = getConfig()

export default function BallparksPage({ leagueData }: PageProps) {
    const router = useRouter()
    const { page, sort, direction } = router.query
    const ballparks = useChroniclerToFetchBallparks()
    
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
	if(!ballparks) {
		return <AstrologyLoader />
	}
    if(ballparks.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${ballparks.error}`} />
    }

    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseBallparkAttributes.includes(currentSort) ? "asc" : "desc")  
            : "desc"

    const allBallparks = ballparks.data
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    const filteredBallparks = allBallparks.filter((ballpark) => ballpark.data.model !== null)
    const sortedBallparks = currentSort ? Array.from(filteredBallparks).sort(BallparkComparator(leagueData.teams, currentSort, currentDirection)) : filteredBallparks
    const pageBallparks = sortedBallparks.slice(currentPage * pageLimit, Math.min((currentPage + 1) * pageLimit, sortedBallparks.length))
    const numPages = Math.ceil(sortedBallparks.length / pageLimit)

    const sortBallparks = (newSort: string) => {
        let newDirection: "asc" | "desc" | null = null;
        if(newSort === currentSort) {
            switch(currentDirection) {
                case "asc":
                    newDirection = reverseBallparkAttributes.includes(newSort) ? "desc" : null
                    break;
                case "desc":
                    newDirection = reverseBallparkAttributes.includes(newSort) ? null : "asc"
                    break;
            }
        } else {
            newDirection = reverseBallparkAttributes.includes(newSort) ? "asc" : "desc"
        }
        if(newDirection) {
            router.push({
                query: {
                    sort: newSort,
                    direction: newDirection,
                }
            }, undefined, { shallow: true })
        } else {
            router.push({}, undefined, { shallow: true })
        }
    }

    return (
        <section className="overflow-auto">
            <TeamHeader team={AllBallparks} />
            <Pagination 
                href={{
                    pathname: "/ballparks",
                    query: {
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                    }
                    
                }}
                exportData={{
                    data: exportBallparkData(allBallparks), 
                    filename: "ballparks",
                }}
                currentPage={currentPage} 
                numPages={numPages} 
            />
            {allBallparks.length > 0 && pageBallparks.length > 0 
                ? <div className="overflow-auto">
                    <BallparkTable 
                        ballparks={pageBallparks} 
                        teams={leagueData.teams}
                        sort={currentSort} 
                        direction={currentDirection} 
                        triggerSort={sortBallparks}
                    />
                </div>
                : <h1 className="text-3xl text-center font-bold p-5">Huh, it looks like not enough ballparks with that criteria exist.</h1>
            }
            <Pagination 
                href={{
                    pathname: "/ballparks",
                    query: {
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                    }
                    
                }}
                exportData={{
                    data: exportBallparkData(sortedBallparks), 
                    filename: "ballparks",
                }}
                currentPage={currentPage} 
                numPages={numPages} 
            />
        </section>
    )
}

BallparksPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="Ballparks - Astrology" 
            description="Check out your favorite ballparks and learn how many birds (positive and negative) live in them!"
            {...props}
        >
			{page}
		</Layout>
	)
}