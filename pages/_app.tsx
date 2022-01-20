import { MouseEventHandler, ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { LeagueData, useChroniclerToFetchLeagueData } from './api/chronicler'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement, props?: PageProps) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export type PageProps = {
	leagueData?: LeagueData,
	isDarkMode?: boolean,
	isItemApplied?: boolean,
	isShowSimplified?: boolean,
	toggleItemAdjustments?: MouseEventHandler,
	toggleLights?: MouseEventHandler,
	toggleSimpleStats?: MouseEventHandler,
}

function Astrology({ Component, pageProps }: AppPropsWithLayout) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page)
    const leagueData = useChroniclerToFetchLeagueData()

	const [isShowSimplified, setIsShowSimplified] = useState<boolean>(checkLocalStorage("isShowSimplified", true));
	//const [canSeeRealStars, setCanSeeRealStars] = useState<boolean>(checkLocalStorage("canSeeRealStars", false));
	const [isDarkMode, setIsDarkMode] = useState<boolean>(checkLocalStorage("isDarkMode", true));
	const [isItemApplied, setIsItemApplied] = useState<boolean>(checkLocalStorage("isItemApplied", false));

	useEffect(() => {
		if(isDarkMode) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	})
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

export default Astrology