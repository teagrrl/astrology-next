import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import AstrologyError from '../components/error'
import ItemTable from '../components/itemtable'
import Layout from '../components/layout'
import AstrologyLoader from '../components/loader'
import Pagination from '../components/pagination'
import TeamHeader from '../components/teamheader'
import { ItemComparator } from '../models/item'
import { reverseAttributes } from '../models/playerstats'
import { TheArmory } from '../models/team'
import { PageProps } from './_app'

const { publicRuntimeConfig } = getConfig()

export default function ItemsPage({ leagueData, isShowSimplified }: PageProps) {
    const router = useRouter()
    const { page, sort, direction } = router.query

    const currentPage = page ? parseInt(page.toString()) : 0
    const currentSort = sort ? sort.toString() : undefined
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
            
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    const allItems = leagueData.items ? Object.values(leagueData.items) : []
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    const filteredItems = allItems
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
            <TeamHeader team={TheArmory} />
            <Pagination href={{
                pathname: "/items",
                query: {
                    sort: currentSort,
                    direction: currentSort ? currentDirection : undefined,
                }
            }} currentPage={currentPage} numPages={numPages} />
            <div className="overflow-auto">
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
            <Pagination href={{
                pathname: "/items",
                query: {
                    sort: currentSort,
                    direction: currentSort ? currentDirection : undefined,
                }
            }} currentPage={currentPage} numPages={numPages} />
        </section>
	)
}

ItemsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}