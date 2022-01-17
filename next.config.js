/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
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
		]
	},
}
