import type { ReactElement } from 'react'
import Link from 'next/link'
import getConfig from 'next/config'
import { PageProps } from '@pages/_app'
import Layout from '@components/layout'

type IndexProps = PageProps & {

}

const { publicRuntimeConfig } = getConfig()

export default function IndexPage({}: IndexProps) {
	const twitterHandle = publicRuntimeConfig.twitterHandle ?? "yoorilikeglass"

	return (
		<section className="flex flex-col grow justify-center text-center">
			<h1 className="text-6xl sm:text-8xl font-bold mb-4">Astrology</h1>
			<h2 className="text-2xl p-4 font-semibold">
				<span className="p-0.5">Peer deeper into Blaseball.</span> 
				<Link href="/teams"><a className="p-0.5 hover:px-2 rounded-md transition-all hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white">Read your team&apos;s star charts.</a></Link>
			</h2>
			<p className="flex justify-center items-center">
				<span className="p-1.5 mx-1.5">@yooori#1569</span> 
				<span> &#x2022; </span>
				<a className="p-1.5 mx-1.5 rounded-md transition-all hover:px-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white" href={`https://twitter.com/${twitterHandle}`}>twitter</a> 
				<span> &#x2022; </span> 
				<Link href="/legacy">
                    <a className="p-1.5 mx-1.5 rounded-md transition-all hover:px-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white">legacy astrology</a> 
                </Link>
				<span> &#x2022;  </span>
				<a className="p-1.5 mx-1.5 rounded-md transition-all hover:px-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white" href="https://sibr.dev/">SIBR</a>
			</p>
		</section>
	)
}

IndexPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout {...props}>
			{page}
		</Layout>
	)
}