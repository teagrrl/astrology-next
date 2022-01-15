import { ReactNode } from 'react'
import { PageProps } from '../pages/_app'
import Footer from './footer'
import Navigation from './navigation'

type LayoutProps = PageProps & {
    children?: ReactNode, 
    hasFooter?: boolean, 
}

export default function Layout({ children, hasFooter, canSeeFk, isDarkMode, isItemApplied, toggleForbiddenKnowledge, toggleItemAdjustments, toggleLights } : LayoutProps) {
    return (
        <div className="flex flex-col h-screen w-screen bg-white dark:bg-gray-900 text-black dark:text-white transition">
            <nav className="p-1">
                <Navigation isDarkMode={isDarkMode} />
            </nav>
            <main className="flex flex-col grow overflow-hidden">{children}</main>
            {hasFooter && <footer className="flex flex-row flex-wrap justify-end gap-1 p-2">
                <Footer 
                    canSeeFk={canSeeFk} 
                    isDarkMode={isDarkMode}
                    isItemApplied={isItemApplied} 
                    toggleForbiddenKnowledge={toggleForbiddenKnowledge} 
                    toggleItemAdjustments={toggleItemAdjustments} 
                    toggleLights={toggleLights}
                />
            </footer>}
        </div>
    )
}