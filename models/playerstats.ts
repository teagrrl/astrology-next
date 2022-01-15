import Item from "./item"
import Player from "./player"
import { PlayerItem, PlayerState } from "./types"

const reverseAttributes = ["patheticism", "tragicness", "pressurization"]

const attributeIds = ["buoyancy", "divinity", "martyrdom", "moxie", "musclitude", "patheticism", "thwackability", "tragicness", "coldness", "overpowerment", "ruthlessness", "shakespearianism", "suppression", "unthwackability", "totalFingers", "baseThirst", "continuation", "groundFriction", "indulgence", "laserlikeness", "anticapitalism", "chasiness", "omniscience", "tenaciousness", "watchfulness", "pressurization", "cinnamon", "deceased", "soul", "fate", "peanutAllergy", "blood", "coffee", "ritual"] as const
type AttributeTuple = typeof attributeIds
type AttributeId = AttributeTuple[number]

const categoryIds = ["combined", "baserunning", "batting", "defense", "pitching", "bsrr", "erpr", "slgbr", "wobabr"] as const
type CategoryTuple = typeof categoryIds
type CategoryId = CategoryTuple[number]

export default class PlayerStats {
    public readonly stats: Record<string, string | number | boolean | string[] | PlayerItem[] | PlayerState>;
    public readonly adjustments: Record<string, number>;
    public readonly adjusted: Record<string, string | number | boolean | string[] | PlayerItem[] | PlayerState>;

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
            switch(key) {
                case "combined":
                    return this.hasItemAdjustment("baserunning") || this.hasItemAdjustment("batting") || this.hasItemAdjustment("defense") || this.hasItemAdjustment("pitching")
                case "baserunning":
                    return Object.keys(this.adjustments).filter((attribute) => ["baseThirst", "laserlikeness", "continuation", "indulgence", "groundFriction"].includes(attribute)).length > 0
                case "batting":
                    return Object.keys(this.adjustments).filter((attribute) => ["tragicness", "thwackability", "moxie", "divinity", "musclitude", "patheticism", "martyrdom"].includes(attribute)).length > 0
                case "defense":
                    return Object.keys(this.adjustments).filter((attribute) => ["omniscience", "tenaciousness", "watchfulness", "anticapitalism", "chasiness"].includes(attribute)).length > 0
                case "pitching":
                    return Object.keys(this.adjustments).filter((attribute) => ["shakespearianism", "unthwackability", "coldness", "overpowerment", "ruthlessness"].includes(attribute)).length > 0
                case "bsrr":
                    return Object.keys(this.adjustments).filter((attribute) => ["baseThirst", "continuation", "laserlikeness", "indulgence"].includes(attribute)).length > 0
                case "erpr":
                    return Object.keys(this.adjustments).filter((attribute) => [ "unthwackability", "overpowerment", "ruthlessness"].includes(attribute)).length > 0
                case "slgbr":
                    return Object.keys(this.adjustments).filter((attribute) => ["thwackability", "divinity", "musclitude", "patheticism", "groundFriction"].includes(attribute)).length > 0
                case "wobabr":
                    return Object.keys(this.adjustments).filter((attribute) => ["thwackability", "divinity", "moxie", "musclitude", "martyrdom", "patheticism", "groundFriction"].includes(attribute)).length > 0
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

    ERPR(isItemApplied?: boolean): number {
        return (this.get("overpowerment", isItemApplied) as number) * 0.1
            + (this.get("ruthlessness", isItemApplied) as number) * 0.74
            + (this.get("unthwackability", isItemApplied) as number) * 0.16;
    }

    SLGBR(isItemApplied?: boolean): number {
        return (this.get("divinity", isItemApplied) as number) * 0.25
            + (this.get("musclitude", isItemApplied) as number) * 0.13
            + (this.get("patheticism", isItemApplied) as number) * 0.11
            + (this.get("thwackability", isItemApplied) as number) * 0.37
            + (this.get("groundFriction", isItemApplied) as number) * 0.15;
    }

    wOBABR(isItemApplied?: boolean): number {
        return (this.get("divinity", isItemApplied) as number) * 0.21 
            + (this.get("martyrdom", isItemApplied) as number) * 0.07
            + (this.get("moxie", isItemApplied) as number) * 0.09
            + (this.get("musclitude", isItemApplied) as number) * 0.04
            + (this.get("patheticism", isItemApplied) as number) * 0.17
            + (this.get("thwackability", isItemApplied) as number) * 0.35
            + (this.get("groundFriction", isItemApplied) as number) * 0.06;
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
            adjustments[attribute] = (adjustments[attribute] ?? 0) + value;
        }
        return adjustments
    }, {})
}

function getAdjustedStats(stats: Record<string, string | number | boolean | string[] | PlayerItem[] | PlayerState>, adjustments: Record<string, number>) {
    const adjusted: Record<string, string | number | boolean | string[] | PlayerItem[] | PlayerState> = {}
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