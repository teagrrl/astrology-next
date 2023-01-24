import getConfig from "next/config"
import Head from "next/head"
import { useRouter } from "next/router"

const { publicRuntimeConfig } = getConfig()

export type MetadataProps = {
    title?: string,
    description?: string,
    image?: string,
}

export default function Metadata({ title, description, image }: MetadataProps) {
    const { asPath } = useRouter()
    const absoluteUrl = process.env.NODE_ENV === "development" 
        ? "http://localhost:3000" 
        : process.env.VERCEL_URL ? ("https://" + process.env.VERCEL_URL) : undefined

    const siteName = "Astrology - A quick look at Blaseball Star Charts."
    const siteTitle = title ?? siteName
    const socialDescription = description ?? "Horoscopes for the advanced Blaseball fan. Read simple or detailed Star Charts for your favorite Teams, Players, and more!"
    const socialImage = image ?? (absoluteUrl ?? "") + "/astrology_preview.png"
    const twitterHandle = publicRuntimeConfig.twitterHandle
    
    return (
        <Head>
            <title>{siteTitle}</title>
            <meta charSet="utf-8" key="charset" />
            <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" key="viewport" />
            <meta name="description" content={socialDescription} key="description" />
            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" key="twsummary" />
            {!!twitterHandle && <meta property="twitter:creator" content={twitterHandle} key="twcreator" />}
            <meta name="twitter:description" content={socialDescription} key="twdescription" />
            <meta name="twitter:title" content={siteTitle} key="twtitle" />
            <meta name="twitter:image" content={socialImage} key="twimage" />
            {/* Open Graph */}
            <meta property="og:description" content={socialDescription} key="ogdescription" />
            <meta property="og:site_name" content={siteName} key="ogsitename" />
            <meta property="og:title" content={siteTitle} key="ogtitle" />
            <meta property="og:image" content={socialImage} key="ogimage" />
            {!!absoluteUrl && <meta property="og:url" content={absoluteUrl + asPath} key="ogurl" />}
        </Head>
    )
}