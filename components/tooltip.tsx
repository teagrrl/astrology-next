import Tippy from "@tippyjs/react"
import { ReactElement, ReactNode } from "react"

type TooltipProps = {
    children: ReactElement,
    content: ReactNode,
    maxWidth?: number,
}

export default function Tooltip({ children, content, maxWidth }: TooltipProps) {
    return (
        <Tippy 
            className="relative px-2 py-1 rounded-md text-white dark:text-black bg-zinc-600/90 dark:bg-zinc-100" 
            duration={[200, 0]}
            maxWidth={maxWidth}
            content={content}
        >
            {children}
        </Tippy>
    )
}