import { MouseEventHandler, ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import useSWR from 'swr'
import { leagueFetcher } from '@models/api2'
import Player from '@models/player2'
import { LeagueData, useChroniclerToFetchLeagueData } from '@models/api'
import Team from '@models/team2'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement, props?: PageProps) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export type PageProps = {
    leagueData?: LeagueData,
	teams?: Team[],
    players?: Player[],
	error?: string,
	isDarkMode?: boolean,
	isItemApplied?: boolean,
	isShowSimplified?: boolean,
	toggleItemAdjustments?: MouseEventHandler,
	toggleHelp?: MouseEventHandler,
	toggleLights?: MouseEventHandler,
	toggleSimpleStats?: MouseEventHandler,
}

function Astrology({ Component, pageProps }: AppPropsWithLayout) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page)
    const leagueData = useChroniclerToFetchLeagueData()
    
    const { data, error } = useSWR("leaguedata2", leagueFetcher)

	const [isShowSimplified, setIsShowSimplified] = useState<boolean>(true)
	//const [canSeeRealStars, setCanSeeRealStars] = useState<boolean>(false)
	const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
	const [isItemApplied, setIsItemApplied] = useState<boolean>(false)

	useEffect(() => {
		setIsShowSimplified(checkLocalStorage("isShowSimplified", true))
		//setCanSeeRealStars(checkLocalStorage("canSeeRealStars", false))
		setIsDarkMode(checkLocalStorage("isDarkMode", true))
		setIsItemApplied(checkLocalStorage("isItemApplied", false))
		if(isDarkMode) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	}, [isDarkMode])
	pageProps.isShowSimplified = isShowSimplified
	//pageProps.canSeeRealStars = canSeeRealStars
	pageProps.isDarkMode = isDarkMode
	pageProps.isItemApplied = isItemApplied
	pageProps.toggleSimpleStats = () => {
		setInLocalStorage("isShowSimplified", !isShowSimplified)
		setIsShowSimplified(!isShowSimplified)
	}
	pageProps.toggleItemAdjustments = () => {
		setInLocalStorage("isItemApplied", !isItemApplied)
		setIsItemApplied(!isItemApplied)
	}
	pageProps.toggleLights = () => {
		if(document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.remove("dark")
		} else {
			document.documentElement.classList.add("dark")
		}
		setInLocalStorage("isDarkMode", !isDarkMode)
		setIsDarkMode(!isDarkMode)
	}
    pageProps.leagueData = leagueData
    pageProps.players = data?.players
	pageProps.teams = data?.teams
	pageProps.error = error?.toString()

	return getLayout(<Component {...pageProps} />, pageProps)
}

function setInLocalStorage(key: string, value: any) {
	if(typeof window !== "undefined" && window.localStorage) {
		localStorage.setItem(key, value)
	}
}

function checkLocalStorage(key: string, defaultValue: any) {
	if(typeof window !== "undefined" && window.localStorage) {
		const storedValue = localStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : defaultValue;
	}
	return defaultValue;
}

export function removeDiacritics(slug: string) {
	return slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default Astrology