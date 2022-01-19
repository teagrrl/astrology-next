import Modification from "./modification"

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
            {permanent?.map((id) => 
                <Modification key={`permanent_${id}`} id={id} duration="permanent" type={type} />
            )}
            {season?.map((id) => 
                <Modification key={`season_${id}`} id={id} duration="season" type={type} />
            )}
            {week?.map((id) => 
                <Modification key={`week_${id}`} id={id} duration="week" type={type} />
            )}
            {game?.map((id) => 
                <Modification key={`game_${id}`} id={id} duration="game" type={type} />
            )}
            {item?.map((id) => 
                <Modification key={`item_${id}`} id={id} duration="item" type={type} />
            )}
        </>
    )
}