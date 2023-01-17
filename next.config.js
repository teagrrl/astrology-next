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
				source: '/legacy/team',
				destination: '/legacy/teams',
				permanent: true,
			},
			{
				source: '/legacy/player',
				destination: '/legacy/players',
				permanent: true,
			},
			{
				source: '/legacy/item',
				destination: '/legacy/items',
				permanent: true,
			},
			{
				source: '/legacy/squeezer',
				destination: '/legacy/squeezer/beta',
				permanent: true,
			},
			{
				source: '/legacy/ballpark',
				destination: '/legacy/ballparks',
				permanent: true,
			},
		]
	},
}
