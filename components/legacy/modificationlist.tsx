import Modification from "@components/legacy/modification"

type ModificationListProps = {
    type: "player" | "team" | "ballpark",
    permanent?: string[],
    season?: string[],
    week?: string[],
    game?: string[],
    item?: string[],
}

export default function ModificationList({ type, permanent, season, week, item, game }: ModificationListProps) {
    return (
        <>
            {permanent?.map((id, index) => 
                <Modification key={`permanent_${id}_${index}`} id={id} duration="permanent" type={type} />
            )}
            {season?.map((id, index) => 
                <Modification key={`season_${id}_${index}`} id={id} duration="season" type={type} />
            )}
            {week?.map((id, index) => 
                <Modification key={`week_${id}_${index}`} id={id} duration="week" type={type} />
            )}
            {game?.map((id, index) => 
                <Modification key={`game_${id}_${index}`} id={id} duration="game" type={type} />
            )}
            {item?.map((id, index) => 
                <Modification key={`item_${id}_${index}`} id={id} duration="item" type={type} />
            )}
        </>
    )
}