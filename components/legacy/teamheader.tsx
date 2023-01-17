import Team from "@models/team"
import Emoji from "@components/emoji"

type TeamHeaderProps = {
    team: Team,
}

export default function TeamHeader({ team }: TeamHeaderProps) {
    return (
		<div className="flex justify-center items-center text-center p-5">
            <Emoji className="h-14 w-14 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team.data.mainColor }} emoji={team.data.emoji} emojiClass="h-8 w-8" />
            <div>
                <div className="text-3xl font-bold">
                    <span>{team.canonicalName()} </span>
                    {team.type !== "special" && <a href={`https://blaseball.com/team/${team.id}`} title={`Go to official team page for the ${team.canonicalName()}`}><Emoji emoji="0x1F517" emojiClass="inline w-6 h-6 align-[-0.1em]" /></a>}
                </div>
                <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{team.data.slogan}</div>
            </div>
        </div>
    )
}