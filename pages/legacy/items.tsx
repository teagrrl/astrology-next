import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AstrologyError from '@components/error'
import { exportItemData } from '@components/legacy/exportcsv'
import ItemTable from '@components/legacy/itemtable'
import Layout from '@components/legacy/layout'
import AstrologyLoader from '@components/loader'
import Pagination from '@components/pagination'
import TeamHeader from '@components/legacy/teamheader'
import { ItemComparator } from '@models/item'
import { reverseAttributes } from '@models/playerstats'
import { TheArmory } from '@models/team'
import { PageProps } from '@pages/_app'

const { publicRuntimeConfig } = getConfig()

export default function ItemsPage({ leagueData, isShowSimplified }: PageProps) {
    const router = useRouter()
    const { page, sort, direction, owners } = router.query
            
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }

    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
    const currentOwners = (typeof owners === "string" ? owners.split(",") : owners ?? [])
        .filter((filter) => ["active", "inactive", "bargain"].includes(filter))

    const allItems = leagueData.items ? Object.values(leagueData.items) : []
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    const filteredItems = currentOwners.length > 0 ? allItems.filter((item) => {
        const owners = leagueData.armory[item.id] ?? []
        const positions = owners.map((player) => leagueData.positions[player.id].position ?? "unknown")
        return (currentOwners.includes("active") && positions.filter((position) => ["lineup", "rotation"].includes(position)).length > 0)
            || (currentOwners.includes("inactive") && positions.filter((position) => ["shadows", "static", "unknown"].includes(position)).length > 0)
            || (currentOwners.includes("bargain") && !owners.length)
    }) : allItems
    const sortedItems = currentSort ? Array.from(filteredItems).sort(ItemComparator(leagueData.armory, currentSort, currentDirection)) : filteredItems
    const pageItems = sortedItems.slice(currentPage * pageLimit, Math.min((currentPage + 1) * pageLimit, sortedItems.length))
    const numPages = Math.ceil(sortedItems.length / pageLimit)

    const sortItems = (newSort: string) => {
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
        if(newDirection) {
            router.push({
                query: {
                    owners: currentOwners,
                    sort: newSort,
                    direction: newDirection,
                }
            }, undefined, { shallow: true })
        } else {
            router.push({
                query: {
                    owners: currentOwners,
                }
            }, undefined, { shallow: true })
        }
    }
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={TheArmory} />
            <Pagination 
                href={{
                    pathname: "/legacy/items",
                    query: {
                        owners: currentOwners,
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                    }
                }}
                exportData={{
                    data: exportItemData(sortedItems, leagueData.armory), 
                    filename: "items",
                }}
                currentPage={currentPage} 
                numPages={numPages} 
            />
            {allItems.length > 0 && pageItems.length > 0 
                ? <div className="overflow-auto">
                    <ItemTable 
                        items={pageItems} 
                        armory={leagueData.armory} 
                        positions={leagueData.positions} 
                        sort={currentSort} 
                        direction={currentDirection} 
                        triggerSort={sortItems}
                        isShowSimplified={isShowSimplified} 
                    />
                </div>
                : <h1 className="text-3xl text-center font-bold p-5">Huh, it looks like not enough items with that criteria exist.</h1>
            }
            <Pagination 
                href={{
                    pathname: "/legacy/items",
                    query: {
                        owners: currentOwners,
                        sort: currentSort,
                        direction: currentSort ? currentDirection : undefined,
                    }
                }} 
                exportData={{
                    data: exportItemData(sortedItems, leagueData.armory), 
                    filename: "items",
                }}
                currentPage={currentPage} 
                numPages={numPages} 
            />
        </section>
	)
}

ItemsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Armory &amp; Bargain Bin - Astrology" 
            description="Take a look at every single item in Blaseball." 
            hasFooter={true} 
            {...props}
        >
			{page}
		</Layout>
	)
}