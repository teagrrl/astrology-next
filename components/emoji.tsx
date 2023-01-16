import { CSSProperties } from "react"
import twemoji from "@twemoji/api"

type EmojiProps = { 
    className?: string,
    emoji: string, 
    emojiClass?: string,
    style?: CSSProperties,
}

export default function Emoji({ className, emoji, emojiClass, style } : EmojiProps) {
    return (
        <i className={className} style={style} dangerouslySetInnerHTML={{__html: twemoji.parse(isNaN(Number(emoji)) ? emoji : twemoji.convert.fromCodePoint(emoji), { className: emojiClass }) }} />
    )
}