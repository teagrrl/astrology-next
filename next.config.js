/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	publicRuntimeConfig: {
		pageLimit: 50,
		paginationPreview: 3,
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
		]
	},
}
