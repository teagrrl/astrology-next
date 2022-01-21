import Tippy from "@tippyjs/react";
import { ReactNode } from "react";

type SortProps = {
    id?: string,
    direction?: "asc" | "desc",
}

type TableHeaderProps = {
    children: ReactNode,
    colSpan?: number,
    title?: string,
    sortId?: string,
    sortBy?: SortProps,
    triggerSort?: Function,
}

export default function TableHeader({ children, colSpan, title, sortId, sortBy, triggerSort }: TableHeaderProps) {
    const isSortHeader = sortBy ? sortId === sortBy.id : false

    function sortItems() {
        if(triggerSort) {
            triggerSort(sortId)
        }
    }

    return (
        <th colSpan={colSpan} className="duration-300 hover:bg-zinc-400/20" onClick={sortItems}>
            {title
                ? <Tippy 
                    className="p-2 rounded-md font-semibold text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100"
                    duration={[200, 0]}
                    content={(isSortHeader ? "Sorted by " : "") + title}
                >
                    <div className="px-1.5 py-1 text-center cursor-default">
                        <span>{children}</span>
                        {getSortSymbolForDirection(sortId, sortBy)}
                    </div>
                </Tippy>
                : <div className="px-1.5 py-1 text-center cursor-default">
                    <span>{children}</span>
                    {getSortSymbolForDirection(sortId, sortBy)}
                </div>
            }
        </th>
    )
}

function getSortSymbolForDirection(sortId?: string, sortBy?: SortProps) {
    const direction = sortBy && sortId === sortBy.id ? sortBy.direction : undefined
    switch(direction) {
        case "asc":
            return <span className="ml-1">{"\u25B2"}</span>
        case "desc":
            return <span className="ml-1">{"\u25BC"}</span>
        default:
            return <></>
    }
}