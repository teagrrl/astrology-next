import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import ItemTable from '../components/itemtable'
import Layout from '../components/layout'
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
    console.log(direction && ["asc", "desc"].includes(direction.toString()), currentSort && reverseAttributes.includes(currentSort))
    const currentDirection = direction 
        ? (direction.toString() as "asc" | "desc") 
        : currentSort 
            ? (reverseAttributes.includes(currentSort) ? "asc" : "desc") 
            : "desc"
    const allItems = leagueData?.items ? Object.values(leagueData.items) : []
    const pageLimit = publicRuntimeConfig.pageLimit ?? 50
    const filteredItems = allItems
    const sortedItems = currentSort ? filteredItems.sort(ItemComparator(leagueData?.armory, currentSort, currentDirection)) : filteredItems
    const pageItems = sortedItems.slice(currentPage * pageLimit, Math.min((currentPage + 1) * pageLimit, sortedItems.length))
    const numPages = Math.ceil(sortedItems.length / pageLimit)
	
	return (
        <section className="overflow-auto">
            <TeamHeader team={TheArmory} />
            <Pagination basePath={`/items?${currentSort ? `sort=${currentSort}&` : ""}${currentDirection ? `direction=${currentDirection}&` : ""}`} currentPage={currentPage} numPages={numPages} />
            <ItemTable items={pageItems} armory={leagueData?.armory} positions={leagueData?.positions} sort={currentSort} direction={currentDirection} isShowSimplified={isShowSimplified} />
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