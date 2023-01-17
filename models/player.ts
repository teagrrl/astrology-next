import Item, { getItemFromArmorOrBat } from "@models/item";
import PlayerStats, { reverseAttributes } from "@models/playerstats";
import Team from "@models/team";
import { ChroniclerPlayer, ChroniclerEntity, ChroniclerItem } from "@models/chronicler";

export type PlayerPosition = {
    position?: "lineup" | "rotation" | "shadows" | "static" | undefined,
    team?: Team | undefined,
}

export default class Player {
    public readonly id: string
    public readonly data: ChroniclerPlayer
    public readonly items: Item[]
    public readonly oldMods: string[]

    constructor(data: ChroniclerEntity<ChroniclerPlayer>) {
        this.id = data.entityId
        this.data = data.data
        const { items, mods } = getItemsAndOldMods(data.data.items ?? [], data.data.bat, data.data.armor)
        this.items = items
        this.oldMods = mods
    }

    blood() {
        return bloodTypes[this.data.blood] ?? "Blood?";
    }

    canonicalName() : string {
        return this.data.state?.unscatteredName ?? this.data.name;
    }

    coffee() {
        return coffeeStyles[this.data.coffee] ?? "Coffee?";
    }

    modifications(isSignificant?: boolean) {
        return [
            ...(isSignificant ? [] : this.data.gameAttr ?? []),
            ...(this.data.weekAttr ?? []),
            ...(this.data.seasAttr ?? []),
            ...(this.data.permAttr ?? []),
            ...((this.data.itemAttr ?? []).concat(this.oldMods)),
        ]
    }

    slug() : string {
        if(this.canonicalName().startsWith("Clone")) { // screw these guys lmao
            return this.id
        }
        switch(this.id) { // this sucks but i don't wanna do a "good" solution
            case "1f747294-df75-42e2-ba7f-aa0dfcca2beb":
                return "mild-sancho-thrower"
            case "44adbb77-feab-4392-906a-bf04ef3aa8aa":
                return "also-layla-pork"
            case "47d646fe-a45c-47b4-bd07-38110ec00bbe":
                return "levar-shoethiefmaker"
            case "48c44e04-dd37-4cf8-8b0a-e228ce0401cd":
                return "stale-copernicus-biscuits"
            case "5d063a91-31b3-4688-97a7-e34a7181da30":
                return "lil-pitchy"
            case "82067351-3038-4001-bfac-9ecdae67d504":
                return "bees-manhattan-of-hades"
            case "a8399207-a19c-449e-a3bf-4311fbea8ebd":
                return "taller-everts"
            case "bc4187fa-459a-4c06-bbf2-4e0e013d27ce":
                return "original-sixpack-dogwalker"
            case "fc94eb21-e4bb-4ad2-adfb-69543a774996":
                return "slightly-burned-worf-hatchler"
        }
        return this.canonicalName().toLowerCase().replace(/,/g, "-comma-").replace(/[.']+/g, "").replace(/[-\s]+/g, "-");
    }
    
    soulscream() {
        const letters = ["A", "E", "I", "O", "U", "X", "H", "A", "E", "I"];
        const stats = [this.data.pressurization ?? 0, this.data.divinity, this.data.tragicness, this.data.shakespearianism, this.data.ruthlessness];
        
        let soulscream = "";
        let i;
        for(i = 0; i < Math.min(this.data.soul, 300); i++) {
            let magnitude = 1 / Math.pow(10, i);
            for(let j = 0; j < 11; j++) {
                soulscream += letters[Math.floor(((stats[j % stats.length] % magnitude) / magnitude) * 10)];
            }
        }
        if(i < this.data.soul) {
            soulscream += "... (CONT. FOR " + (this.data.soul - i) + " SOUL)";
        }

        return soulscream;
    }
}

function getItemsAndOldMods(entities: ChroniclerItem[], bat?: string, armor?: string) {
    const items = entities.map((entity) => new Item(entity))
    const mods = []
    if(bat) {
        const batItem = new Item(getItemFromArmorOrBat(bat, "Bat"))
        items.push(batItem)
        for(const id in batItem.mods) {
            mods.push(batItem.mods[id])
        }
    }
    if(armor) {
        const armorItem = new Item(getItemFromArmorOrBat(armor, "Armor"))
        items.push(armorItem)
        for(const id in armorItem.mods) {
            mods.push(armorItem.mods[id])
        }
    }
    return {
        items: items,
        mods: mods,
    }
}

function getComparatorValue(positions: Record<string, PlayerPosition> | undefined, player: Player, attribute: string, isItemApplied?: boolean) {
    switch(attribute) {
        case "items":
            return player.items.length + player.items.reduce((rating, item) => rating + item.healthRating(), 0) / 1000
        case "modifications":
            return player.modifications().length
        case "name":
            return player.canonicalName()
        case "peanutAllergy":
            return player.data.peanutAllergy ? -1 : 1
        case "position":
            if(positions) {
                switch(positions[player.id].position) {
                    case "lineup":
                        return 2
                    case "rotation":
                        return 1
                    case "shadows":
                        return 0
                    case "static":
                        return -1
                }
            }
            return -Infinity
        case "team":
            return positions ? positions[player.id].team?.canonicalNickname() ?? "zzzzz" : "zzzzzz"
        default:
            const stats = new PlayerStats(player)
            const attributeValue = stats.get(attribute, isItemApplied)
            if(typeof attributeValue === "number") {
                return attributeValue
            }
            return player.id
    }
}

export const PlayerComparator = (positions: Record<string, PlayerPosition> | undefined, column: string, direction?: "asc" | "desc", isItemApplied?: boolean) => {
    return (player1: Player, player2: Player) => {
        let comparison = 0;
        let attribute1 = getComparatorValue(positions, player1, column, isItemApplied)
        let attribute2 = getComparatorValue(positions, player2, column, isItemApplied)
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

const bloodTypes = [
    "A",
    "AAA",
    "AA",
    "Acidic",
    "Basic",
    "O",
    "O No",
    "H₂O",
    "Electric",
    "Love",
    "Fire",
    "Psychic",
    "Grass",
    "Ball",
    "Strike"
]

const coffeeStyles = [
    "Black",
    "Light & Sweet",
    "Macchiato",
    "Cream & Sugar",
    "Cold Brew",
    "Flat White",
    "Americano",
    "Espresso",
    "Heavy Foam",
    "Latte",
    "Decaf",
    "Milk Substitute",
    "Plenty of Sugar",
    "Anything",
]