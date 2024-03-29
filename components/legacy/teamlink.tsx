import Link from "next/link"
import { CSSProperties } from "react"
import Team from "@models/team"
import Emoji from "@components/emoji"

type TeamLinkProps = {
    team: Team,
    isDarkMode?: boolean,
    useFullName?: boolean,
}

export default function TeamLink({ team, isDarkMode, useFullName }: TeamLinkProps) {
    const linkStyle: CSSProperties = {}
    if(isDarkMode) {
        linkStyle.color = team.data.secondaryColor
    } else {
        linkStyle.backgroundColor = team.data.secondaryColor
    }

    return (
        <Link href={team.type === "special" ? `/legacy/${team.id}` : `/legacy/team/${team.slug()}`}>
            <a className="flex items-center px-1.5 py-1 rounded-md font-semibold transition hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:text-black">
                <Emoji className="h-7 w-7 flex justify-center items-center rounded-full" style={{ backgroundColor: team.data.mainColor }} emoji={team.data.emoji} emojiClass="h-4 w-4" />
                <span className="ml-1.5 px-1.5 py-0.5 rounded-md whitespace-nowrap" style={linkStyle}>{useFullName ? team.canonicalName() : team.data.shorthand}</span>
            </a>
        </Link>
    )
}