import { ItemPart, PlayerItem } from './types'

export default class Item {
    public readonly durability: number
    public readonly emoji: string
    public readonly health: number
    public readonly id: string
    public readonly name: string
    public readonly adjustments

    constructor(data: PlayerItem) {
        this.id = data.id
        this.name = data.name
        this.health = data.health
        this.durability = data.durability
        this.emoji = emojiForRoot(data.root.name)
        this.adjustments = getAdjustments(data)
    }

    isBroken(): boolean {
        return this.durability > 0 && this.health < 1
    }

    status(): string {
        if(this.durability < 1) {
            return "Unbreakable"
        } else if(this.health < 1) {
            return "Broken"
        } else {
            return this.health + "/" + this.durability
        }
    }
}

function getAdjustments(data: PlayerItem) {
    const adjustments: Record<string, number> = {}
    const affixes = [data.prePrefix, data.postPrefix, data.root, data.suffix].concat(data.prefixes).filter((affix): affix is ItemPart => !!affix)
    for(const affix of affixes) {
        for(const adjustment of affix.adjustments) {
            if(adjustment.type === 1) {
                let statName = adjustmentIndices[adjustment.stat]
                adjustments[statName] = (adjustments[statName] ?? 0) + adjustment.value;
            }
        }
    }
    return adjustments;
}
    
function emojiForRoot(root: string) {
    switch(root) {
        case "Base":
            return "0x1F539";
        case "Bat":
            return "0x1F3CF";
        case "Board":
            return "0x1F6F9";
        case "Broom":
            return "0x1F9F9";
        case "Cannon":
            return "0x1F52B";
        case "Cap":
            return "0x1F9E2";
        case "Cape":
            return "0x1F9E3";
        case "Chair":
            return "0x1FA91";
        case "Egg":
            return "0x1F95A";
        case "Field":
            return "0x1F535";
        case "Glove":
            return "0x1F9E4";
        case "Helmet":
            return "0x1FA96";
        case "Jacket":
            return "0x1F9E5";
        case "Jersey":
            return "0x1F455";
        case "Necklace":
            return "0x1F4FF";
        case "Phone":
            return "0x260E";
        case "Pillow":
            return "0x1F411";
        case "Potion":
            return "0x2697";
        case "Quill":
            return "0x1FAB6";
        case "Ring":
            return "0x1F48D";
        case "Socks":
            return "0x1F9E6";
        case "Shoes":
            return "0x1F45F";
        case "Sunglasses":
            return "0x1F576";
        default:
            return "0x2753";
    }
}

const adjustmentIndices = ["tragicness", "buoyancy", "thwackability", "moxie", "divinity", "musclitude", "patheticism", "martyrdom", "cinnamon", "baseThirst", "laserlikeness", "continuation", "indulgence", "groundFriction", "shakespearianism", "suppression", "unthwackability", "coldness", "overpowerment", "ruthlessness", "pressurization", "omniscience", "tenaciousness", "watchfulness", "anticapitalism", "chasiness"]