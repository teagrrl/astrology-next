import { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import useSWR from 'swr'
import { LeagueData, useChroniclerToFetchLeagueData } from '@models/api'
import { leagueFetcher } from '@models/api2'
import Player from '@models/player2'
import Team from '@models/team2'
import '../styles/globals.css'

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
	isShowColors?: boolean,
	isItemApplied?: boolean,
	isShowSimplified?: boolean,
	scaleColors?: string[],
	toggleLights?: Function,
	toggleColors?: Function,
	toggleItemAdjustments?: Function,
	toggleSimpleStats?: Function,
	changeColors?: Function,
}

export const scaleColorNames = ["Terrible", "Bad", "Poor", "Okay", "Good", "Great", "Exceptional", "Elite", "Super Elite"]
export const defaultScaleColors = ["#ef4444", "#fb923c", "#fcd34d", "#bef264", "#86efac", "#2dd4bf", "#93c5fd", "#c4b5fd", "#e879f9"]

function Astrology({ Component, pageProps }: AppPropsWithLayout) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page)
    const leagueData = useChroniclerToFetchLeagueData()
    
    const { data, error } = useSWR("leaguedata2", leagueFetcher)

	const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
	const [isShowColors, setIsShowColors] = useState<boolean>(true)
	const [isItemApplied, setIsItemApplied] = useState<boolean>(false)
	const [isShowSimplified, setIsShowSimplified] = useState<boolean>(true)
	const [scaleColors, setScaleColors] = useState<string[]>([])

	const updateColors = useCallback((colors: string[]) => {
		setScaleColors(colors)
	}, [])

	useEffect(() => {
		setIsDarkMode(checkLocalStorage("isDarkMode", true))
		setIsShowColors(checkLocalStorage("isShowColors", true))
		setIsItemApplied(checkLocalStorage("isItemApplied", false))
		setIsShowSimplified(checkLocalStorage("isShowSimplified", true))
		setScaleColors(checkLocalStorage("scaleColors", defaultScaleColors))
		if(isDarkMode) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	}, [isDarkMode])
	pageProps.isDarkMode = isDarkMode
	pageProps.isShowColors = isShowColors
	pageProps.isItemApplied = isItemApplied
	pageProps.isShowSimplified = isShowSimplified
	pageProps.scaleColors = scaleColors
	pageProps.toggleLights = (value?: boolean) => {
		const newIsDarkMode = value === undefined ? !isDarkMode : value
		if(newIsDarkMode && !document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
		setInLocalStorage("isDarkMode", newIsDarkMode)
		setIsDarkMode(newIsDarkMode)
	}
	pageProps.toggleColors = (value?: boolean) => {
		const newIsShowColors = value === undefined ? !isShowColors : value
		setInLocalStorage("isShowColors", newIsShowColors)
		setIsShowColors(newIsShowColors)
	}
	pageProps.toggleItemAdjustments = (value?: boolean) => {
		const newIsItemApplied = value === undefined ? !isItemApplied : value
		setInLocalStorage("isItemApplied", newIsItemApplied)
		setIsItemApplied(newIsItemApplied)
	}
	pageProps.toggleSimpleStats = (value?: boolean) => {
		const newIsShowSimplified = value === undefined ? !isShowSimplified : value
		setInLocalStorage("isShowSimplified", newIsShowSimplified)
		setIsShowSimplified(newIsShowSimplified)
	}
	pageProps.changeColors = updateColors
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
		const storedValue = localStorage.getItem(key)
		return storedValue ? JSON.parse(storedValue) : defaultValue
	}
	return defaultValue
}

export function removeDiacritics(slug: string) {
	return slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function hexToRGBA(color?: string, alpha?: number) {
    if(!color) return color
    if(color.startsWith("#")) {
        color = color.slice(1)
    }
    if(!alpha) { 
        alpha = 0.6
    } else if(alpha > 1) {
        alpha = 1
    } else if(alpha < 0) {
        alpha = 0
    }
    return `rgba(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4), 16)}, ${alpha})`
}

export function range(num: number) {
    return Array.from(Array(num).keys())
}

export default Astrology