import { ReactNode } from 'react'
import { PageProps } from '../pages/_app'
import Footer from './footer'
import Navigation from './navigation'

type LayoutProps = PageProps & {
    children?: ReactNode, 
    hasFooter?: boolean, 
}

export default function Layout({ children, hasFooter, isDarkMode, isItemApplied, isShowSimplified, toggleItemAdjustments, toggleLights, toggleSimpleStats } : LayoutProps) {
    return (
        <div className="flex flex-col h-screen w-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition">
            <nav className="p-1">
                <Navigation isDarkMode={isDarkMode} />
            </nav>
            <main className="flex flex-col grow overflow-hidden">{children}</main>
            {hasFooter && <footer className="flex flex-row flex-wrap justify-end gap-1 p-2">
                <Footer 
                    isDarkMode={isDarkMode}
                    isItemApplied={isItemApplied} 
                    isShowSimplified={isShowSimplified} 
                    toggleItemAdjustments={toggleItemAdjustments} 
                    toggleLights={toggleLights}
                    toggleSimpleStats={toggleSimpleStats} 
                />
            </footer>}
        </div>
    )
}