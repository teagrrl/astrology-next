import Team from "../models/team"
import Emoji from "./emoji"

type TeamHeaderProps = {
    team: Team,
}

export default function TeamHeader({ team }: TeamHeaderProps) {
    return (
		<div className="flex justify-center items-center text-center p-5">
            <Emoji className="h-14 w-14 flex justify-center items-center rounded-full mr-2" style={{ backgroundColor: team.data.secondaryColor }} emoji={team.data.emoji} emojiClass="h-8 w-8" />
            <div>
                {team.type === "special"
                    ? <div className="text-3xl font-bold">{team.canonicalName()}</div>
                    : <a className="text-3xl font-bold" href={`https://blaseball.com/team/${team.id}`}>{team.canonicalName()}</a>
                }
                <div className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{team.data.slogan}</div>
            </div>
        </div>
    )
}