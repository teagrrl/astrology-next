import Item from "./item";
import PlayerStats, { reverseAttributes } from "./playerstats";
import Team from "./team";
import { BlaseballPlayer, ChroniclerEntity } from "./types";

export type PlayerPosition = {
    position?: "lineup" | "rotation" | "shadows" | "static" | undefined,
    team?: Team | undefined,
}

export default class Player {
    public readonly id: string
    public readonly data: BlaseballPlayer
    public readonly items: Item[]

    constructor(data: ChroniclerEntity<BlaseballPlayer>) {
        this.id = data.entityId
        this.data = data.data
        this.items = data.data.items?.map((item) => new Item(item)) ?? []
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
            ...(this.data.itemAttr ?? []),
        ]
    }

    slug() : string {
        if(this.id === "5d063a91-31b3-4688-97a7-e34a7181da30") {
            return "baby-pitching-machine";
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