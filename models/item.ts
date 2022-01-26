import Player from './player'
import { reverseAttributes } from './playerstats'
import { ItemPart, ChroniclerItem } from './chronicler'

type Affix = {
    name: string,
    adjustments: Record<string, number>,
}
export default class Item {
    public readonly adjustments: Record<string, number>
    public readonly affixes: Affix[]
    public readonly durability: number
    public readonly elements: string[]
    public readonly emoji: string
    public readonly health: number
    public readonly id: string
    public readonly mods: string[]
    public readonly name: string
    public readonly type: string
    public readonly weight: number

    constructor(data: ChroniclerItem) {
        this.id = data.id
        this.name = data.name
        this.health = data.health
        this.durability = data.durability
        this.type = data.root.name
        this.emoji = emojiForRoot(this.type)
        const { adjustments, affixes, elements, mods, weight } = getAffixProperties(data)
        this.affixes = affixes
        this.adjustments = adjustments
        this.elements = elements
        this.mods = mods
        this.weight = weight
    }

    getScaleClass(key: string) {
        let value = this.adjustments[key]
        return getColorClassForValue(reverseAttributes.includes(key) ? -1 * value : value)
    }

    healthRating(): number {
        return this.durability < 0 ? Infinity : (this.health + this.durability / 100)
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

function getComparatorValue(item: Item, owners: number, attribute: string) {
    if(adjustmentIndices.includes(attribute)) {
        return item.adjustments[attribute] ?? 0
    }
    switch(attribute) {
        case "durability":
            return item.healthRating()
        case "elements":
            return item.weight
        case "modifications":
            return item.mods.length
        case "name":
            return item.name
        case "owners":
            return owners
        default:
            return item.id
    }
}

export const ItemComparator = (owners: Record<string, Player[]> | undefined, column: string, direction?: "asc" | "desc") => {
    return (item1: Item, item2: Item) => {
        let comparison = 0;
        let attribute1 = getComparatorValue(item1, owners && owners[item1.id] ? owners[item1.id].length : 0, column)
        let attribute2 = getComparatorValue(item2, owners && owners[item2.id] ? owners[item2.id].length : 0, column)
        if(attribute1 !== attribute2) {
            if (attribute1 > attribute2 || attribute1 === void 0) comparison = 1;
            if (attribute1 < attribute2 || attribute2 === void 0) comparison = -1;
        }
        comparison = attribute1 > attribute2 ? -1 : 1
        if(reverseAttributes.includes(column) && direction !== "desc") {
            comparison *= -1
        } else if(direction === "asc") {
            comparison *= -1
        }
        return comparison
    }
}

function getAffixProperties(data: ChroniclerItem) {
    const adjustments: Record<string, number> = {}
    const partAdjustments: Affix[] = []
    const elements: string[] = []
    const mods: string[] = []
    const affixes = [data.prePrefix, data.postPrefix, data.root, data.suffix].concat(data.prefixes).filter((affix): affix is ItemPart => !!affix)
    for(const affix of affixes) {
        const affixAdjustments: Record<string, number> = {}
        // clean up the name a little bit so it looks nicer
        const affixName = affix.name.startsWith("the ")
            ? affix.name.substring(4) 
            : affix.name.endsWith("'s") 
                ? affix.name.substring(0, affix.name.length - 2) 
                : affix.name
        if(affix.name !== data.root.name) {
            elements.push(affixName)
        }
        for(const adjustment of affix.adjustments) {
            if(adjustment.type === 0) {
                mods.push(adjustment.mod)
            }
            if(adjustment.type === 1) {
                let statName = adjustmentIndices[adjustment.stat]
                adjustments[statName] = (adjustments[statName] ?? 0) + adjustment.value;
                affixAdjustments[statName] = (affixAdjustments[statName] ?? 0) + adjustment.value;
            }
        }
        partAdjustments.push({
            name: affixName,
            adjustments: affixAdjustments,
        })
    }
    const elementCounts = elements
        .reduceRight((count, element: string) => {
                count.set(element, (count.get(element) ?? 0) + 1)
                return count
        }, new Map<string, number>())
    return {
        adjustments: adjustments, 
        affixes: partAdjustments,
        elements: Array.from(elementCounts.entries()).map(([element, count]) => element + (count > 1 ? (" x" + count) : "")),
        mods: mods,
        weight: elements.length,
    };
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

function getColorClassForValue(value: number) {
    if(value > 1) {
        return "bg-fuchsia-400/50";
    } else if(value > 0.8) {
        return "bg-violet-300/50";
    } else if(value > 0.6) {
        return "bg-blue-300/60";
    } else if(value > 0.4) {
        return "bg-teal-400/50";
    } else if(value > 0.2) {
        return "bg-green-300/50";
    } else if(value > 0) {
        return "bg-lime-300/50";
    }  else if(value < -0.5) {
        return "bg-red-500/60";
    } else if(value < -0.25) {
        return "bg-orange-400/60";
    } else if(value < 0) {
        return "bg-amber-300/60";
    } else {
        return "";
    };
}

const adjustmentIndices = ["tragicness", "buoyancy", "thwackability", "moxie", "divinity", "musclitude", "patheticism", "martyrdom", "cinnamon", "baseThirst", "laserlikeness", "continuation", "indulgence", "groundFriction", "shakespearianism", "suppression", "unthwackability", "coldness", "overpowerment", "ruthlessness", "pressurization", "omniscience", "tenaciousness", "watchfulness", "anticapitalism", "chasiness"]