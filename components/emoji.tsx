import { CSSProperties } from "react"
import twemoji from "twemoji"

type EmojiProps = { 
    className?: string,
    emoji: string, 
    emojiClass?: string,
    style?: CSSProperties,
}

export default function Emoji({ className, emoji, emojiClass, style } : EmojiProps) {
    // TODO: tweomji ts support is a mess
    const parsed = twemoji.parse(isNaN(Number(emoji)) ? emoji : twemoji.convert.fromCodePoint(emoji), { className: emojiClass }) as unknown as string
    const replacedCdn = parsed.replace('twemoji.maxcdn.com/v', 'cdnjs.cloudflare.com/ajax/libs/twemoji')
    return (
        <i className={className} style={style} dangerouslySetInnerHTML={{__html: replacedCdn }} />
    )
}