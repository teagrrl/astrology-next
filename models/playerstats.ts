import Item from "./item"
import Player from "./player"
import { ChroniclerItem, PlayerState } from "./chronicler"

export const reverseAttributes = ["name", "rank", "team", "patheticism", "tragicness", "pressurization"]

export const attributeIds = ["buoyancy", "divinity", "martyrdom", "moxie", "musclitude", "patheticism", "thwackability", "tragicness", "coldness", "overpowerment", "ruthlessness", "shakespearianism", "suppression", "unthwackability", "totalFingers", "baseThirst", "continuation", "groundFriction", "indulgence", "laserlikeness", "anticapitalism", "chasiness", "omniscience", "tenaciousness", "watchfulness", "pressurization", "cinnamon", "deceased", "soul", "fate", "peanutAllergy", "blood", "coffee", "ritual"] as const
type AttributeTuple = typeof attributeIds
export type AttributeId = AttributeTuple[number]

export const categoryIds = ["combined", "baserunning", "batting", "defense", "pitching", "bsrr", "dripdr", "erpr", "slgbr", "wobabr"] as const
type CategoryTuple = typeof categoryIds
type CategoryId = CategoryTuple[number]

export default class PlayerStats {
    public readonly stats: Record<string, string | number | boolean | string[] | ChroniclerItem[] | PlayerState>;
    public readonly adjustments: Record<string, number>;
    public readonly adjusted: Record<string, string | number | boolean | string[] | ChroniclerItem[] | PlayerState>;

    constructor(player: Player) {
        this.stats = {...player.data}
        this.adjustments = getItemAdjustments(player.items)
        this.adjusted = getAdjustedStats(this.stats, this.adjustments)
    }

    hasItemAdjustment(key: string): boolean {
        if(isValidAttributeId(key)) {
            return !!this.adjustments[key]
        }
        if(isValidCategoryId(key)) {
            const attributesHasAdjustments = (attributes: string[]) => Object.keys(this.adjustments).filter((attribute) => attributes.includes(attribute) && this.adjustments[attribute] !== 0).length > 0
            switch(key) {
                case "combined":
                    return this.hasItemAdjustment("baserunning") || this.hasItemAdjustment("batting") || this.hasItemAdjustment("defense") || this.hasItemAdjustment("pitching")
                case "baserunning":
                    return attributesHasAdjustments(["baseThirst", "laserlikeness", "continuation", "indulgence", "groundFriction"])
                case "batting":
                    return attributesHasAdjustments(["tragicness", "thwackability", "moxie", "divinity", "musclitude", "patheticism", "martyrdom"])
                case "defense":
                    return attributesHasAdjustments(["omniscience", "tenaciousness", "watchfulness", "anticapitalism", "chasiness"])
                case "pitching":
                    return attributesHasAdjustments(["shakespearianism", "unthwackability", "coldness", "overpowerment", "ruthlessness"])
                case "bsrr":
                    return attributesHasAdjustments(["baseThirst", "continuation", "laserlikeness", "indulgence"])
                case "dripdr":
                    return attributesHasAdjustments(["anticapitalism", "omniscience", "tenaciousness"])
                case "erpr":
                    return attributesHasAdjustments(["unthwackability", "overpowerment", "ruthlessness"])
                case "slgbr":
                    return attributesHasAdjustments(["thwackability", "divinity", "musclitude", "patheticism", "groundFriction"])
                case "wobabr":
                    return attributesHasAdjustments(["thwackability", "divinity", "moxie", "musclitude", "martyrdom", "patheticism", "groundFriction"])
            }
        }
        return false
    }

    get(key: string, isItemApplied?: boolean) {
        if(isValidAttributeId(key)) {
            return isItemApplied ? this.adjusted[key] : this.stats[key]
        }
        if(isValidCategoryId(key)) {
            return this.getRating(key, isItemApplied)
        }
        return 0;
    }

    getScaleClass(key: string, isItemApplied?: boolean) {
        let value = this.get(key, isItemApplied) as number
        if(key === "combined") {
            value /= 4
        }
        return getColorClassForValue(reverseAttributes.includes(key) ? 1 - value : value)
    }

    getRating(key: string, isItemApplied?: boolean) {
        switch(key) {
            case "combined":
                return this.combinedRating(isItemApplied)
            case "baserunning":
                return this.baserunningRating(isItemApplied)
            case "batting":
                return this.battingRating(isItemApplied)
            case "defense":
                return this.defenseRating(isItemApplied)
            case "pitching":
                return this.pitchingRating(isItemApplied)
            case "bsrr":
                return this.BsRR(isItemApplied)
            case "dripdr":
                return this.DRiPDR(isItemApplied)
            case "erpr":
                return this.ERPR(isItemApplied)
            case "slgbr":
                return this.SLGBR(isItemApplied)
            case "wobabr":
                return this.wOBABR(isItemApplied)
        }
    }
    
    combinedRating(isItemApplied?: boolean): number {
        return this.baserunningRating(isItemApplied)
            + this.battingRating(isItemApplied)
            + this.defenseRating(isItemApplied)
            + this.pitchingRating(isItemApplied)
    }
    
    baserunningRating(isItemApplied?: boolean): number {
        return Math.pow(this.get("laserlikeness", isItemApplied) as number, 0.5)
            * Math.pow(this.get("continuation", isItemApplied) as number, 0.1)
            * Math.pow(this.get("baseThirst", isItemApplied) as number, 0.1)
            * Math.pow(this.get("indulgence", isItemApplied) as number, 0.1)
            * Math.pow(this.get("groundFriction", isItemApplied) as number, 0.1)
    }
    
    battingRating(isItemApplied?: boolean): number {
        return Math.pow(1 - (this.get("tragicness", isItemApplied) as number), 0.01)
            * Math.pow(this.get("buoyancy", isItemApplied) as number, 0)
            * Math.pow(this.get("thwackability", isItemApplied) as number, 0.35)
            * Math.pow(this.get("moxie", isItemApplied) as number, 0.075)
            * Math.pow(this.get("divinity", isItemApplied) as number, 0.35)
            * Math.pow(this.get("musclitude", isItemApplied) as number, 0.075)
            * Math.pow(1 - (this.get("patheticism", isItemApplied) as number), 0.05)
            * Math.pow(this.get("martyrdom", isItemApplied) as number, 0.02)
    }
    
    defenseRating(isItemApplied?: boolean): number {
        return Math.pow(this.get("omniscience", isItemApplied) as number, 0.2)
            * Math.pow(this.get("tenaciousness", isItemApplied) as number, 0.2)
            * Math.pow(this.get("watchfulness", isItemApplied) as number, 0.1)
            * Math.pow(this.get("anticapitalism", isItemApplied) as number, 0.1)
            * Math.pow(this.get("chasiness", isItemApplied) as number, 0.1)
    }
    
    pitchingRating(isItemApplied?: boolean): number {
        return Math.pow(this.get("shakespearianism", isItemApplied) as number, 0.1)
            * Math.pow(this.get("suppression", isItemApplied) as number, 0)
            * Math.pow(this.get("unthwackability", isItemApplied) as number, 0.5)
            * Math.pow(this.get("coldness", isItemApplied) as number, 0.025)
            * Math.pow(this.get("overpowerment", isItemApplied) as number, 0.15)
            * Math.pow(this.get("ruthlessness", isItemApplied) as number, 0.4)
    }

    BsRR(isItemApplied?: boolean): number {
        return (this.get("baseThirst", isItemApplied) as number) * 0.16
            + (this.get("continuation", isItemApplied) as number) * 0.21
            + (this.get("indulgence", isItemApplied) as number) * 0.06
            + (this.get("laserlikeness", isItemApplied) as number) * 0.58;
    }

    DRiPDR(isItemApplied?: boolean): number {
        return (this.get("anticapitalism", isItemApplied) as number) * 0.25
            + (this.get("omniscience", isItemApplied) as number) * 0.4
            + (this.get("tenaciousness", isItemApplied) as number) * 0.35;
    }

    ERPR(isItemApplied?: boolean): number {
        return (this.get("overpowerment", isItemApplied) as number) * 0.1
            + (this.get("ruthlessness", isItemApplied) as number) * 0.74
            + (this.get("unthwackability", isItemApplied) as number) * 0.16;
    }

    SLGBR(isItemApplied?: boolean): number {
        return (this.get("divinity", isItemApplied) as number) * 0.25
            + (this.get("musclitude", isItemApplied) as number) * 0.13
            + (1 - (this.get("patheticism", isItemApplied) as number)) * 0.11
            + (this.get("thwackability", isItemApplied) as number) * 0.37
            + (this.get("groundFriction", isItemApplied) as number) * 0.14;
    }

    wOBABR(isItemApplied?: boolean): number {
        return (this.get("divinity", isItemApplied) as number) * 0.21 
            + (this.get("martyrdom", isItemApplied) as number) * 0.07
            + (this.get("moxie", isItemApplied) as number) * 0.09
            + (this.get("musclitude", isItemApplied) as number) * 0.04
            + (1 - (this.get("patheticism", isItemApplied) as number)) * 0.17
            + (this.get("thwackability", isItemApplied) as number) * 0.35
            + (this.get("groundFriction", isItemApplied) as number) * 0.06;
    }

    vibes(isItemApplied?: boolean) {
        return {
            maximum: this.get("pressurization", isItemApplied),
            minimum: this.get("cinnamon", isItemApplied),
            frequency: this.get("buoyancy", isItemApplied),
        }
    }
}

function isValidAttributeId(attribute: string): attribute is AttributeId {
    return attributeIds.includes(attribute as AttributeId);
}

function isValidCategoryId(category: string): category is CategoryId {
    return categoryIds.includes(category as CategoryId);
}

function getItemAdjustments(items: Item[]) {
    return items.reduce((adjustments: Record<string, number>, item) => {
        for(const [attribute, value] of Object.entries(item.adjustments)) {
            adjustments[attribute] = (adjustments[attribute] ?? 0) + (item.isBroken() ? 0 : value);
        }
        return adjustments
    }, {})
}

function getAdjustedStats(stats: Record<string, string | number | boolean | string[] | ChroniclerItem[] | PlayerState>, adjustments: Record<string, number>) {
    const adjusted: Record<string, string | number | boolean | string[] | ChroniclerItem[] | PlayerState> = {}
    for(const [attribute, value] of Object.entries(stats)) {
        adjusted[attribute] = value
        if(typeof value === "number") {
            adjusted[attribute] = value + (adjustments[attribute] ?? 0)
            if(adjusted[attribute] >= 1 && reverseAttributes.includes(attribute)) {
                adjusted[attribute] = 0.999
            }
            if(adjusted[attribute] < 0 && !reverseAttributes.includes(attribute)) {
                adjusted[attribute] = 0.001
            }
        }
    }
    return adjusted
}

export function getColorClassForValue(value: number) {
    if(value > 1.45) {
        return "bg-fuchsia-400/50";
    } else if(value > 1.15) {
        return "bg-violet-300/50";
    } else if(value > 0.95) {
        return "bg-blue-300/60";
    } else if(value > 0.85) {
        return "bg-teal-400/50";
    } else if(value > 0.65) {
        return "bg-green-300/50";
    }  else if(value < 0.15) {
        return "bg-red-500/60";
    } else if(value < 0.25) {
        return "bg-orange-400/60";
    } else if(value < 0.45) {
        return "bg-amber-300/60";
    } else {
        return "bg-lime-300/50";
    };
}