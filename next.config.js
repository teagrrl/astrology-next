/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	publicRuntimeConfig: {
		pageLimit: 50,
		paginationPreview: 3,
		twitterHandle: "yooridotblase",
	},
	async redirects() {
		return [
			{
				source: '/team',
				destination: '/teams',
				permanent: true,
			},
			{
				source: '/player',
				destination: '/players',
				permanent: true,
			},
			{
				source: '/item',
				destination: '/items',
				permanent: true,
			},
			{
				source: '/squeezer',
				destination: '/squeezer/beta',
				permanent: true,
			},
			{
				source: '/ballpark',
				destination: '/ballparks',
				permanent: true,
			},
		]
	},
}
