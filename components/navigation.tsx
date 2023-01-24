import React from 'react'
import Link from 'next/link'
import { PageProps } from '@pages/_app'
import Emoji from '@components/emoji'

export default function Navigation({ isDarkMode }: PageProps) {
    const links = [
        {
            emoji: "0x26BE",
            text: "The Players",
            href: "/players",
            textColor: "#aaaaaa",
            bgColor: "#424242",
        },
        {
            emoji: "0x1FA78",
            text: "The Teams",
            href: "/teams",
            textColor: "#c58585",
            bgColor: "#8f3232",
        },
        {
            emoji: "0x1F4DA",
            text: "The Annex",
            href: "/annex",
            textColor: "#da94d4",
            bgColor: "#885a84",
        },
    ]

    return (
        <nav className="min-h-[2.75em] m-1 overflow-auto md:min-h-[auto] md:overflow-visible">
            <ul className="flex flex-row md:justify-center items-center gap-1 md:flex-wrap">
                {links.map((link, index) => 
                    <li key={`nav_${index}`}>
                        <Link href={link.href}>
                            <a className="flex items-center px-1.5 py-1 rounded-md font-semibold transition hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:text-black">
                                <Emoji className="h-7 w-7 flex justify-center items-center rounded-full" style={{ backgroundColor: link.bgColor }} emoji={link.emoji} emojiClass="h-4 w-4" />
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-md whitespace-nowrap" style={isDarkMode ? { color: link.textColor } : { backgroundColor: link.textColor }}>{link.text}</span>
                            </a>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}