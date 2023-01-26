import { ReactNode } from "react"
import Modification from "@models/modification2"
import Tooltip from "@components/tooltip"

type ModificationListProps = {
    modifications: Modification[],
    hasBorder?: boolean,
}

export default function ModificationList({ modifications, hasBorder }: ModificationListProps) {
    return (
        <>
            {modifications.map((mod, index) =>
                <Tooltip key={`modification_${index}`} content={mod.description ? mod.description : mod.name}>
                    <div className={`${hasBorder ? "px-3 py-1 border-2 rounded-md font-bold cursor-default " : ""}whitespace-nowrap`} style={{ borderColor: mod.color, backgroundColor: mod.backgroundColor, color: mod.textColor }}>
                        {mod.name}
                    </div>
                </Tooltip>
            )}
        </>
    )
}