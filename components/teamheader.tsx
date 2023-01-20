import Team from "@models/team2"
import Emoji from "@components/emoji"
import Tooltip from "@components/tooltip"

type TeamHeaderProps = {
    team: Team,
}

export default function TeamHeader({ team }: TeamHeaderProps) {
    return (
        <div className="flex flex-col p-5 gap-5">
            <div className="flex flex-row items-center gap-2">
                <Emoji className="h-14 w-14 flex justify-center items-center rounded-full" style={{ backgroundColor: team.primaryColor }} emoji={team.emoji} emojiClass="h-8 w-8" />
                <div className="flex flex-col text-center">
                    <h1 className="text-3xl font-bold">{team.name}</h1>
                    <h3 className="text-xl italic before:content-[open-quote] after:content-[close-quote]">{team.slogan}</h3>
                </div>
                <div className="flex flex-grow justify-end">
                    <div className="grid grid-cols-2 gap-x-2">
                        <span className="font-semibold">Shorthand: </span><span>{team.shorthand}</span>
                        <span className="font-semibold">Division: </span><span>{team.division}</span>
                        <span className="font-semibold">Season Record: </span><span>{team.wins}-{team.losses}{team.wins + team.losses > 0 && `, ${convertToWinPercentage(team.wins, team.losses)} W%`}</span>
                    </div>
                </div>
            </div>
            {/*<div className="flex flex-row flex-wrap gap-3">
                {team.standings.map((standings, index) => 
                    <Tooltip key={standings.season} content={`Season ${index + 1}: ${convertToWinPercentage(standings.wins, standings.losses)} W%`}>
                        <div className="text-lg cursor-default">
                            <span className="px-2 py-1 border-2 font-bold rounded-l-md">{index + 1}</span>
                            <span className="px-2 py-1 border-2 border-l-0 rounded-r-md">{standings.wins} - {standings.losses}</span>
                        </div>
                    </Tooltip>
                )}
            </div>*/}
        </div>
    )
}

function convertToWinPercentage(wins: number, losses: number) {
    let strVal = (Math.round(wins / (wins + losses) * 1000) / 1000).toString().substring(1)
    while(strVal.length < 4) {
        strVal += "0"
    }
    return strVal
}