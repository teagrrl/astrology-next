import Team from "@models/team2"
import Emoji from "@components/emoji"

type TeamHeaderProps = {
    team: Team,
}

export default function TeamHeader({ team }: TeamHeaderProps) {
    return (
		<div className="flex justify-center items-center text-center p-5">
            <Emoji className="h-14 w-14 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team.primaryColor }} emoji={team.emoji} emojiClass="h-8 w-8" />
            <div>
                <div className="text-3xl font-bold">
                    <span>{team.name} </span>
                </div>
                <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{team.slogan}</div>
            </div>
        </div>
    )
}