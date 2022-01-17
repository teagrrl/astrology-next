import type { ReactElement } from 'react'
import Link from 'next/link'
import Layout from '../components/layout'
import { PageProps } from './_app'

type IndexProps = PageProps & {

}

export default function IndexPage(props?: IndexProps) {
	return (
		<section className="flex flex-col grow justify-center text-center">
			<h1 className="text-8xl font-bold mb-4">Astrology</h1>
			<h2 className="text-2xl my-3.5 font-semibold">
				<span className="p-0.5">A quick look at a Blaseball team&apos;s star charts. </span> 
				<Link href="/teams"><a className="p-0.5 hover:px-2 rounded-md transition-all hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white">Choose a team to begin.</a></Link>
			</h2>
			<p className="flex justify-center items-center">
				<span className="p-1.5 mx-1.5 hover:px-2">@yooori#1569</span> 
				<span> &#x2022; </span>
				<a className="p-1.5 mx-1.5 rounded-md transition-all hover:px-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white" href="https://twitter.com/yooridotblase">twitter</a> 
				<span> &#x2022; </span> 
				<a className="p-1.5 mx-1.5 rounded-md transition-all hover:px-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white" href="https://www.blaseball.com/team/d2634113-b650-47b9-ad95-673f8e28e687">&#x1F52E;</a> 
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
