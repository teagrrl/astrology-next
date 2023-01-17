import { CSSProperties } from "react"
import twemoji from "twemoji"

type EmojiProps = { 
    className?: string,
    emoji: string, 
    emojiClass?: string,
    style?: CSSProperties,
}

export default function Emoji({ className, emoji, emojiClass, style } : EmojiProps) {
    const parsed = twemoji.parse(isNaN(Number(emoji)) ? emoji : twemoji.convert.fromCodePoint(emoji), { className: emojiClass })
    const replacedCdn = parsed.replace('twemoji.maxcdn.com/v', 'cdnjs.cloudflare.com/ajax/libs/twemoji')
    return (
        <i className={className} style={style} dangerouslySetInnerHTML={{__html: replacedCdn }} />
    )
}