import Head from 'next/head'
import { ReactNode } from 'react'
import { PageProps } from '@pages/_app'
import Metadata, { MetadataProps } from '@components/metadata'
import Navigation from '@components/navigation'
import Footer from '@components/footer'

type LayoutProps = PageProps & MetadataProps & {
    children?: ReactNode, 
    hasFooter?: boolean, 
}

export default function Layout({ children, title, description, image, hasFooter, isDarkMode, isShowColors, isItemApplied, isShowSimplified, scaleColors, toggleLights, toggleColors, toggleItemAdjustments, toggleSimpleStats } : LayoutProps) {
    return (
        <div className="flex flex-col h-screen w-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition">
            <Metadata title={title} description={description} image={image} />
            <Head>
                {/* Favicons */}
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/icons/site.webmanifest" />
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#801f2f" />
                <link rel="shortcut icon" href="/icons/favicon.ico" />
                <meta name="msapplication-TileColor" content="#b91d47" />
                <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                <meta name="theme-color" content="#2b2b2b" />
            </Head>
            <Navigation isDarkMode={isDarkMode} />
            <main className="flex flex-col grow overflow-hidden">{children}</main>
            <Footer 
                isSimpleFooter={hasFooter}
                isDarkMode={isDarkMode}
                isShowColors={isShowColors}
                isItemApplied={isItemApplied} 
                isShowSimplified={isShowSimplified} 
                scaleColors={scaleColors}
                toggleItemAdjustments={toggleItemAdjustments} 
                toggleColors={toggleColors}
                toggleLights={toggleLights}
                toggleSimpleStats={toggleSimpleStats} 
            />
        </div>
    )
}