import Tippy from "@tippyjs/react";
import { ReactNode } from "react";

type TableHeaderProps = {
    children: ReactNode,
    colSpan?: number,
    title?: string,
    sort?: "asc" | "desc",
}

export default function TableHeader({ children, colSpan, title, sort }: TableHeaderProps) {
    return (
        <th colSpan={colSpan} className="duration-300 hover:bg-zinc-400/20">
            {title
                ? <Tippy 
                    className="p-2 rounded-md font-semibold text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100"
                    duration={[200, 0]}
                    content={title}
                >
                    <div className="px-1.5 py-1 text-center cursor-default">
                        <span>{children}</span>
                        {getSortSymbolForDirection(sort)}
                    </div>
                </Tippy>
                : <div className="px-1.5 py-1 text-center cursor-default">
                    <span>{children}</span>
                    {getSortSymbolForDirection(sort)}
                </div>
            }
        </th>
    )
}

function getSortSymbolForDirection(direction: "asc" | "desc" | undefined) {
    switch(direction) {
        case "asc":
            return <span className="ml-1">{"\u25B2"}</span>
        case "desc":
            return <span className="ml-1">{"\u25BC"}</span>
        default:
            return <></>
    }
}