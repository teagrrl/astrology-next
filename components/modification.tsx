import Emoji from "./emoji";
import Tooltip from "./tooltip";

type ModificationProps = {
    id: string,
    duration?: ModifierDuration,
    type?: ModifierType,
}

type ModifierDuration = "game" | "week" | "season" | "permanent" | "item" | undefined

type ModifierType = "player" | "team" | "ballpark" | undefined

type ModifierDescriptions = {
    ballpark?: string,
    player?: string,
    team?: string,
}

type Modifier = {
    id: string,
    emoji: string | null,
    title: string,
    description?: string,
    descriptions?: ModifierDescriptions,
}

export function getAllModifications() {
    return Array.from(modifiers).sort((modifier1, modifier2) => {
        if(modifier1.id > modifier2.id) return 1
        if(modifier1.id < modifier2.id) return -1
        return 0
    })
}

export function getModificationTitleById(id: string) {
    return getModifierById(id).title
}

export default function Modification({ id, duration, type }: ModificationProps) {
    const modifier = getModifierById(id)
    if(modifier.emoji) {
        let description;
        if(type && modifier.descriptions && modifier.descriptions[type]) {
            description = modifier.descriptions[type] ?? modifier.title
        } else if(modifier.description) {
            description = modifier.description
        } else {
            description = modifier.title
        }
        return (
            <Tooltip 
                maxWidth={200}
                content={
                    <div className="p-1">
                        <span className="font-semibold"><Emoji emoji={modifier.emoji} emojiClass="inline w-4 h-4 mr-0.5 align-[-0.1em]" /> {modifier.title}</span>
                        {!!description && <p className="text-sm">{description}</p>}
                        {!!duration && 
                            <p className="text-xs border-t-[1px] border-white dark:border-zinc-400 mt-1 pt-1">
                                {duration[0].toUpperCase() + duration.slice(1)} modifications are 
                                {duration === "permanent"
                                    ? " never removed automatically."
                                    : duration === "item" 
                                        ? " removed when the item is lost or broken."
                                        : ` removed at the end of the ${duration}.`
                                }
                            </p>
                        }
                    </div>
                }
            >
                <span><Emoji emoji={modifier.emoji} className="justify-center" emojiClass="inline w-[1em] h-[1em] m-0.5" /></span>
            </Tooltip>
        );
    }
    return <></>
}

function getModifierById(id: string): Modifier {
    return modifiers.find((modifier) => modifier.id === id) || { id: id, emoji: "0x2753", title: id };
}

const modifiers = [
	{
	    id: "EXTRA_STRIKE",
	    emoji: "4️⃣",
	    title: "The Fourth Strike",
        description: "Those with the Fourth Strike will get an extra strike in each at bat.",
        descriptions: {
            player: "This Player will get an extra strike in each at-bat.",
            team: "This Team will get an extra strike in each at-bat."
        }
	},
	{
	    id: "SHAME_PIT",
	    emoji: "0x1F3AF",
	    title: "Targeted Shame",
        description: "Teams with Targeted Shame will start with negative runs the game after being shamed."
	},
	{
	    id: "HOME_FIELD",
	    emoji: "0x1F3E0",
	    title: "Home Field Advantage",
        description: "Teams with Home Field Advantage will start each home game with one run."
	},
	{
	    id: "FIREPROOF",
	    emoji: "0x1F9EF",
	    title: "Fireproof",
        description: "A Fireproof Player can not be incinerated.",
        descriptions: {
            player: "This Player cannot be incinerated.",
            team: "This Team and the Players on it cannot be incinerated."
        }
	},
	{
	    id: "ALTERNATE",
	    emoji: "0x1F465",
	    title: "Alternate",
        description: "This Player is an Alternate...",
        descriptions: {
            player: "This Player is an Alternate...",
            team: "This Team is an Alternate..."
        }
	},
	{
	    id: "SOUNDPROOF",
	    emoji: "0x1F442",
	    title: "Soundproof",
        description: "A Soundproof Player can not be caught in Feedback's reality flickers.",
        descriptions: {
            player: "This Player cannot be caught in Feedback's reality flickers.",
            team: "Players on this Team cannot be caught in Feedback's reality flickers."
        }
	},
	{
	    id: "SHELLED",
	    emoji: "0x1F95C",
	    title: "Shelled",
        description: "A Shelled player is trapped in a big Peanut and is unable to bat or pitch."
	},
	{
	    id: "REVERBERATING",
	    emoji: "0x1F30A",
	    title: "Reverberating",
        description: "A Reverberating Player has a small chance of batting again after each of their At-Bats end."
	},
    {
        id: "BLOOD_DONOR",
        emoji: "0x1F6C1",
        title: "Blood Donor",
        description: "In the Blood Bath, this team will donate Stars to a division opponent that finished behind them in the standings."
    },
    {
        id: "BLOOD_THIEF",
        emoji: "0x1F6C1",
        title: "Blood Thief",
        description: "In the Blood Bath, this team will steal Stars from a division opponent that finished ahead of them in the standings."
    },
    {
        id: "BLOOD_PITY",
        emoji: "0x1F6C1",
        title: "Blood Pity",
        description: "In the Blood Bath, this team must give Stars to the team that finished last in their division."
    },
    {
        id: "BLOOD_WINNER",
        emoji: "0x1F6C1",
        title: "Blood Winner",
        description: "In the Blood Bath, this team must give Stars to the team that finished first in their division."
    },
    {
        id: "BLOOD_FAITH",
        emoji: "0x1F6C1",
        title: "Blood Faith",
        description: "In the Blood Bath, this player will receive a small boost to a random stat."
    },
    {
        id: "BLOOD_LAW",
        emoji: "0x1F6C1",
        title: "Blood Law",
        description: "In the Blood Bath, this team will gain or lose Stars depending on how low or high they finish in their division."
    },
    {
        id: "BLOOD_CHAOS",
        emoji: "0x1F6C1",
        title: "Blood Chaos",
        description: "In the Blood Bath, each player on this team will gain or lose a random amount of Stars."
    },
	{
	    id: "RETURNED",
	    emoji: "0x1F9DB",
	    title: "Returned",
        description: "At the end of each season, this Player has a chance of being called back to the Void."
	},
	{
	    id: "INVERTED",
	    emoji: "0x1F643",
	    title: "Inverted",
        description: "This Player has Inverted."
	},
	{
	    id: "MARKED",
	    emoji: "0x1F635",
	    title: "Unstable",
        description: "Unstable players have a much higher chance of being incinerated in a Solar Eclipse.",
        descriptions: {
            player: "Unstable Players have a much higher chance of being incinerated in a Solar Eclipse.",
            team: "Unstable Teams have a much higher chance of being incinerated in a Solar Eclipse."
        }
	},
	{
	    id: "PARTY_TIME",
	    emoji: "0x1F389",
	    title: "Party Time",
        description: "This Team is mathematically eliminated from the Postseason, and will occasionally receive permanent stats boost in their games."
	},
	{
	    id: "LIFE_OF_PARTY",
	    emoji: "0x1F973",
	    title: "Life of the Party",
        description: "This Team gets 10% more from their Party Time stat boosts."
	},
	{
	    id: "DEBT_ZERO",
	    emoji: "0x1F4B3",
	    title: "Debt",
        description: "This Player must fulfill a debt."
	},
	{
	    id: "DEBT",
	    emoji: "0x1F4B3",
	    title: "Refinanced Debt",
        description: "This Player must fulfill a debt."
	},
	{
	    id: "DEBT_TWO",
	    emoji: "0x1F4B3",
	    title: "Consolidated Debt",
        description: "This Player must fulfill a debt."
	},
	{
	    id: "SPICY",
	    emoji: "0x1F975",
	    title: "Spicy",
        description: "Spicy batters will be Red Hot when they get three consecutive hits."
	},
	{
	    id: "HEATING_UP",
	    emoji: "0x1F336",
	    title: "Heating Up...",
        description: "This batter needs one more consecutive hit to enter Fire mode. This mod will disappear if the batter gets out."
	},
	{
	    id: "ON_FIRE",
	    emoji: "0x1F336",
	    title: "Red Hot!",
        description: "Red Hot! This player's batting is greatly boosted. This mod will disappear if the batter gets out."
	},
	{
	    id: "HONEY_ROASTED",
	    emoji: "0x1F36F",
	    title: "Honey Roasted",
        description: "This Team or Player has been Honey-Roasted.",
        descriptions: {
          player: "This Player has been Honey-Roasted.",
          team: "This Team has been Honey-Roasted."
        }
	},
	{
	    id: "FIRST_BORN",
	    emoji: "0x1F95A",
	    title: "First Born",
        description: "This Player was the first born from the New Field of Eggs."
	},
	{
	    id: "SUPERALLERGIC",
	    emoji: "0x1F922",
	    title: "Superallergic",
        description: "This Player is Superallergic"
	},
	{
	    id: "SUPERYUMMY",
	    emoji: "0x1F60B",
	    title: "Superyummy",
        description: "This Player seriously loves peanuts"
	},
	{
	    id: "EXTRA_BASE",
	    emoji: "0x1F590",
        title: "The Fifth Base",
        description: "Teams playing in this Ballpark must run five bases instead of four.",
        descriptions: {
            ballpark: "Teams playing in this Ballpark must run five bases instead of four.",
            team: "This Team must run five bases instead of four."
        }
	},
	{
	    id: "BLESS_OFF",
	    emoji: "0x26D4",
	    title: "Bless Off",
        description: "This Team cannot win any Blessings in the upcoming Election."
	},
	{
	    id: "NON_IDOLIZED",
	    emoji: "0x1F512",
	    title: "Idol Immune",
        description: "Idol Immune Players cannot be Idolized by Fans."
	},
	{
	    id: "GRAVITY",
	    emoji: "0x1F462",
	    title: "Gravity",
        description: "This Player cannot be affected by Reverb.",
        descriptions: {
            player: "This Player cannot be affected by Reverb.",
            team: "This Team cannot be affected by Reverb."
        }
	},
	{
	    id: "ELECTRIC",
	    emoji: "0x26A1",
	    title: "Electric",
        description: "Electric Teams have a chance of zapping away Strikes.",
        descriptions: {
            player: "When this Player is batting, they have a chance of zapping away Strikes.",
            team: "When this Team is batting, they have a chance of zapping away Strikes."
        }
	},
	{
	    id: "DOUBLE_PAYOUTS",
	    emoji: "0x1F4B8",
	    title: "Super Idol",
        description: "This player will earn Fans double the rewards from all Idol Snacks."
	},
	{
	    id: "FIRE_PROTECTOR",
	    emoji: "0x1F6E1",
	    title: "Fire Protector",
        description: "This Player will protect their teammates from incinerations."
	},
	{
	    id: "RECEIVER",
	    emoji: "0x1F4DE",
	    title: "Receiver",
        description: "This Player is a Receiver."
	},
	{
	    id: "FLICKERING",
	    emoji: "0x1F399",
	    title: "Flickering",
        description: "Flickering players have a much higher chance of being Feedbacked to their opponent."
	},
	{
	    id: "GROWTH",
	    emoji: "0x1F331",
	    title: "Growth",
        description: "Growth teams will play better as the season goes on, up to a 5% global boost by season's end.",
        descriptions: {
            player: "Players with Growth play better as the season goes on, up to a 5% boost by Season's end.",
            team: "Teams with Growth play better as the season goes on, up to a 5% boost by Season's end."
        }
	},
	{
	    id: "BASE_INSTINCTS",
	    emoji: "0x1F3C3",
	    title: "Base Instincts",
        description: "Batters with Base Instincts will have a chance of heading past first base when getting walked.",
        descriptions: {
            player: "This Player has a chance of heading past first base when getting walked.",
            team: "Players batting for this Team have a chance of heading past first base when getting walked."
        }
	},
	{
	    id: "STABLE",
	    emoji: "0x1FAA8",
	    title: "Stable",
        description: "Stable players cannot be made Unstable.",
        descriptions: {
            player: "This Player cannot be made Unstable.",
            team: "This Team and the Players on it cannot be made Unstable."
        }
	},
	{
	    id: "AFFINITY_FOR_CROWS",
	    emoji: "0x1F426",
	    title: "Affinity for Crows",
        description: "Players with Affinity for Crows will hit and pitch 50% better during Birds weather."
	},
	{
	    id: "CURSE_OF_CROWS",
	    emoji: "0x1F426",
	    title: "Curse for Crows",
        description: "This team or player will be occasionally attacked by Birds.",
        descriptions: {
            player: "This Player will be occasionally attacked by Birds.",
            team: "Players playing for this Team will be occasionally attacked by Birds."
        }
	},
	{
	    id: "SQUIDDISH",
	    emoji: "0x1F991",
	    title: "Squiddish",
        description: "When a Squiddish player is incinerated, they'll be replaced by a random Hall of Flame player.",
        descriptions: {
            player: "When a Squiddish player is incinerated, they'll be replaced by a random Hall of Flame player.",
            team: "When this Team is incinerated, it'll be replaced by a random Hall of Flame team."
        }
	},
	{
	    id: "CRUNCHY",
	    emoji: "0x1F36F",
	    title: "Crunchy",
        description: "The Honey-Roasted players on a Crunchy team will hit 100% better and with +200% Power."
	},
	{
	    id: "PITY",
	    emoji: "0x1F90F",
	    title: "Pity",
        description: "This team is holding back, out of Pity."
	},
	{
	    id: "GOD",
	    emoji: "0x1F329",
	    title: "God",
        description: "This team will start with 1,000x the amount of Team Spirit"
	},
	{
	    id: "REPEATING",
	    emoji: "0x1F504",
	    title: "Repeating",
        description: "In Reverb Weather, this Player will Repeat."
	},
	{
	    id: "SUBJECTION",
	    emoji: "0x1F6AA",
	    title: "Subjection",
        description: "Players leaving a team with Subjection will gain the Liberated modification."
	},
	{
	    id: "LIBERATED",
	    emoji: "0x1F574",
	    title: "Liberated",
        description: "Liberated players will be guaranteed extra bases when they get a hit."
	},
	{
	    id: "FIRE_EATER",
	    emoji: "0x2668",
	    title: "Fire Eater",
        description: "Fire Eaters swallow fire instead of being incinerated."
	},
	{
	    id: "MAGMATIC",
	    emoji: null,
	    title: "Magmatic",
        description: "Magmatic players are guaranteed to hit a home run in their next At Bat."
	},
	{
	    id: "LOYALTY",
	    emoji: "0x1F91D",
	    title: "Loyalty",
        description: "Players leaving a team with Loyalty will gain the Saboteur modification."
	},
	{
	    id: "SABOTEUR",
	    emoji: "0x1F608",
	    title: "Saboteur",
        description: "A Saboteur has a chance of intentionally failing."
	},
	{
	    id: "CREDIT_TO_THE_TEAM",
	    emoji: "0x1F4B0",
	    title: "Credit to the Team",
        description: "This player will earn Fans 5x the rewards from all Idol Snacks."
	},
	{
	    id: "LOVE",
	    emoji: "0x2764",
	    title: "Charm",
        description: "Players with Charm have a chance of convincing their opponents to fail."
	},
	{
	    id: "PEANUT_RAIN",
	    emoji: "0x1F95C",
	    title: "Peanut Rain",
        description: "This Team weaponizes Peanut weather against their enemies."
	},
	{
	    id: "FLINCH",
	    emoji: "0x1F628",
	    title: "Flinch",
        description: "Hitters with Flinch cannot swing until a strike has been thrown in the At Bat."
	},
	{
	    id: "WILD",
	    emoji: "0x1F611",
	    title: "Mild",
        description: "Pitchers with Mild have a chance of throwing a Mild Pitch."
	},
	{
	    id: "DESTRUCTION",
	    emoji: "0x1F30B",
	    title: "Destruction",
        description: "Teams with Destruction will add a bunch of Curses to their Opponent when defeating them in battle."
	},
	{
	    id: "SIPHON",
	    emoji: "0x1FA78",
	    title: "Siphon",
        description: "Siphons will steal blood more often in Blooddrain and use it in more ways."
	},
	{
	    id: "FLIICKERRRIIING",
	    emoji: "0x1F399",
	    title: "Fliickerrriiing",
        description: "Fliickerrriiing players are Flickering a lot."
	},
	{
	    id: "FRIEND_OF_CROWS",
	    emoji: "0x1F426",
	    title: "Friend of Crows",
        description: "In Birds weather, pitchers with Friend of Crows will encourage the Birds to attack hitters."
	},
	{
	    id: "BLASERUNNING",
	    emoji: "0x1F3C3",
	    title: "Blaserunning",
        description: "Blaserunners will score .2 Runs for their Team whenever they steal a base."
	},
	{
	    id: "WALK_IN_THE_PARK",
	    emoji: "0x1F6B6",
	    title: "Walk in the Park",
        description: "Those with Walk in the Park will walk to first base on one less Ball."
	},
	{
	    id: "BIRD_SEED",
	    emoji: "0x1F35E",
	    title: "Bird Seed",
        description: "Birds like to eat Bird Seed. They'll peck those with Bird Seed out of peanut shells more often. Because they like to eat Bird Seed."
	},
	{
	    id: "HAUNTED",
	    emoji: "0x1F47B",
	    title: "Haunted",
        description: "Haunted players will occasionally be Inhabited."
	},
	{
	    id: "TRAVELING",
	    emoji: "0x1F9F3",
	    title: "Traveling",
        description: "Traveling teams will play 5% better in Away games."
	},
	{
	    id: "SEALANT",
	    emoji: "0x1FA79",
	    title: "Sealant",
        description: "Players with Sealant cannot have blood drained in Blooddrain."
	},
	{
	    id: "O_NO",
	    emoji: "0x1F631",
	    title: "0 No",
        description: "Players with 0 No cannot be struck out when there are 0 Balls in the Count.",
        descriptions: {
            player: "This Player cannot be struck out when there are 0 Balls in the Count.",
            team: "Players batting for this Team cannot be struck out when there are 0 Balls in the Count."
        }
	},
	{
	    id: "FAIRNESS",
	    emoji: "0x2696",
	    title: "Total Fairness",
        description: "This Season, each team will win only one Blessing, and will be Happy with what they get."
	},
	{
	    id: "ESCAPE",
	    emoji: "0x23F2",
	    title: "Pending",
        description: "The players on this Team are Pending..."
	},
	{
	    id: "UNFLAMED",
	    emoji: "0x1F921",
	    title: "Chaotic",
        description: "The Unstable players on a Chaotic team will hit 100% better."
	},
	{
	    id: "TRIBUTE",
	    emoji: "0x1FA99",
	    title: "Tribute",
        description: "When Hall of Flame Players join this team, they'll add their Tribute as Team Spirit."
	},
	{
	    id: "SQUIDDEST",
	    emoji: "0x1F991",
	    title: "Squiddest",
        description: "This Team is the Squiddest. When a Player joins the Team, they'll become Squiddish."
	},
	{
	    id: "CONTAINMENT",
	    emoji: "0x1F510",
	    title: "Containment",
        description: "This Player cannot spread Instability."
	},
	{
	    id: "RETIRED",
	    emoji: "0x1F6CF",
	    title: "Released",
        description: "This Player is temporarily Inhabiting a Haunted Player."
	},
	{
	    id: "RESTING",
	    emoji: "0x1F6CF",
	    title: "Resting",
        description: "This player is Resting."
	},
	{
	    id: "INHABITING",
	    emoji: "0x1F47B",
	    title: "Inhabiting",
        description: "This player is temporarily Inhabiting a Haunted player."
	},
	{
	    id: "WIRED",
	    emoji: "0x2615",
	    title: "Wired",
        description: "When a Run scores, each Wired Player involved in the play (the Scoring Baserunner, Current Batter, or Current Pitcher) will make the Run worth 0.5 more."
	},
	{
	    id: "TIRED",
	    emoji: "0x2615",
	    title: "Tired",
        description: "When a Run scores, each Tired Player involved in the play (the Scoring Baserunner, Current Batter, or Current Pitcher) with make the Run worth 0.5 less."
	},
	{
	    id: "COFFEE_EXIT",
	    emoji: "0x2615",
	    title: "Percolated",
        description: "This Player has been fully and completely Percolated."
	},
	{
	    id: "COFFEE_SHADOWS",
	    emoji: "0x1F971",
	    title: "Well Rested",
        description: "Whenever a Player on this Team loses the Tired modification, they'll swap with a Player in the Shadows."
	},
	{
	    id: "HARD_BOILED",
	    emoji: "0x1F95A",
	    title: "Hard Boiled",
        description: "This Player was boiled a little bit before hatching."
	},
	{
	    id: "COFFEE_PERIL",
	    emoji: "0x1F441",
	    title: "Observed",
        description: "This Player is being Observed carefully..."
	},
	{
	    id: "COFFEE_RALLY",
	    emoji: "0x1F375",
	    title: "Free Refill",
        description: "Good for one Free Refill."
	},
	{
	    id: "TRIPLE_THREAT",
	    emoji: "0x2615",
	    title: "Triple Threat",
        description: "This pitcher's strikeouts score Unruns when there are 3 runners on base, a runner on 3rd, or 3 Balls in the count. Each condition met is worth .3 Unruns. At the end of the 3rd Inning, there's a 33.33% chance that this mod will disappear."
    },
	{
	    id: "PERK",
	    emoji: "0x2697",
	    title: "Perk",
        description: "This player has been rewarded Percolated energy. They will Overperform in all Coffee weathers."
	},
	{
	    id: "OVERPERFORMING",
	    emoji: "0x2B06",
	    title: "Overperforming",
        description: "This Team or Player will play 20% better than usual.",
        descriptions: {
            player: "This Player will play 20% better than usual.",
            team: "This Team will play 20% better than usual."
		}
	},
	{
	    id: "SHAME_GIVER",
	    emoji: "0x1F3AF",
	    title: "Shame Donor",
        description: "When this Team shames their opponent, that opponent will begin their next game with Unruns."
	},
	{
	    id: "UNDERPERFORMING",
	    emoji: "0x2B07",
	    title: "Underperforming",
        description: "This Team or Player will play 20% worse than usual.",
        descriptions: {
            player: "This Player will play 20% worse than usual.",
            team: "This Team will play 20% worse than usual."
		}
	},
	{
	    id: "EGO1",
	    emoji: "0x1F380",
	    title: "Ego+",
        description: "This Player has a boosted Ego."
	},
	{
	    id: "EGO2",
	    emoji: "0x1F949",
	    title: "Ego++",
        description: "This Player has a boosted boosted Ego."
	},
	{
	    id: "EGO3",
	    emoji: "0x1F948",
	    title: "Ego+++",
        description: "This Player has a boosted boosted boosted Ego."
	},
	{
	    id: "EGO4",
	    emoji: "0x1F947",
	    title: "Ego++++",
        description: "This Player has a boosted boosted boosted boosted Ego."
	},
	{
	    id: "LEGENDARY",
	    emoji: "0x1F3C6",
	    title: "Legendary",
        description: "This Player is Legendary.",
        descriptions: {
            player: "This Player is Legendary",
            team: "This Team is Legendary."
        }
	},
	{
	    id: "ELSEWHERE",
	    emoji: "0x1F3D5",
	    title: "Elsewhere",
        description: "This Player is Elsewhere.",
        descriptions: {
            player: "This Player is Elsewhere.",
            team: "This Team is Elsewhere."
        }
	},
	{
	    id: "BOTTOM_DWELLER",
	    emoji: "0x1F40C",
	    title: "Bottom Dweller",
        description: "If this Team finishes last in their division, they'll be boosted up to 5%."
	},
	{
	    id: "CARCINIZATION",
	    emoji: "0x1F980",
	    title: "Carcinization",
        description: "When this Team activates the Black Hole, they will steal their opponent's best hitter for the remainder of the game."
	},
	{
	    id: "MAINTENANCE_MODE",
	    emoji: "0x1F6A7",
	    title: "Maintenance Mode",
        description: "Whenever a Player on this Team is Impaired, they'll receive the Fourth Out for the remainder of the game."
	},
	{
	    id: "AMBUSH",
	    emoji: "0x1F405",
	    title: "Ambush",
        description: "When a Player is incinerated in a game this Team is playing, a random Hall of Flame Player will join their Shadows."
	},
	{
	    id: "UNDERSEA",
	    emoji: "0x1F42C",
	    title: "Undersea",
        description: "If this Team ever has negative Runs, they'll Overperform for the rest of the game."
	},
	{
	    id: "PENANCE",
	    emoji: "0x1F64F",
	    title: "Penance",
        description: "This Team will start each game by accepting 3 Unruns of Penance."
	},
	{
	    id: "EXTRA_OUT",
	    emoji: "4️⃣",
	    title: "Fourth Out",
        description: "This Team plays with a Fourth Out."
	},
	{
	    id: "STUCK",
	    emoji: "0x1F578",
	    title: "Stuck",
        description: "This player cannot swing."
	},
	{
	    id: "SWIM_BLADDER",
	    emoji: "0x1F93F",
	    title: "Flippers",
        description: "When immateria floods, this Runner will score instead of being cleared from the Bases."
	},
	{
	    id: "DEBT_THREE",
	    emoji: "0x1F4B3",
	    title: "Debt",
        description: "This Player must fulfill a Debt.",
        descriptions: {
            player: "This Player must fulfill a Debt.",
            team: "This Team must fulfill a Debt."
        }
	},
	{
	    id: "ECHO",
	    emoji: "0x1F50A",
	    title: "Echo",
        description: "Echo Echo Echo Echo Echo Echo Echo Echo Echo Echo Echo Echo"
	},
	{
	    id: "STATIC",
	    emoji: "0x1F4AC",
	    title: "Static",
        description: "....."
	},
	{
	    id: "EARLBIRDS",
	    emoji: "0x1F424",
	    title: "Earlbirds",
        description: "This Team or Player will Overperform in the Earlseason.",
        descriptions: {
            player: "This Player will Overperform in the Earlseason.",
            team: "This Team will Overperform in the Earlseason."
        }
	},
	{
	    id: "LATE_TO_PARTY",
	    emoji: "0x1F38A",
	    title: "Late to the Party",
        description: "This Team or Player will Overperform in the Lateseason.",
        descriptions: {
            player: "This Player will Overperform in the Lateseason.",
            team: "This Team will Overperform in the Lateseason."
        }
	},
	{
        id: "EARLY_TO_PARTY",
	    emoji: "0x1FA85",
        title: "Early to the Party",
        description: "This Team or Player will Underperform in the Lateseason.",
        descriptions: {
            player: "This Player will Underperform in the Lateseason.",
            team: "This Team will Underperform in the Lateseason."
        }
    },
	{
	    id: "OVERUNDER",
	    emoji: "0x2935",
	    title: "Over Under",
        description: "Whenever this Player's Team has Over 5 Runs, they'll Underperform."
	},
	{
	    id: "UNDEROVER",
	    emoji: "0x2934",
	    title: "Under Over",
        description: "Whenever this Player's Team has Under 5 Runs, they'll Overperform."
	},
	{
	    id: "WANDERER",
	    emoji: "0x1F697",
	    title: "Roamin'",
        description: "This Player has a chance to Roam at the end of each Season."
	},
	{
	    id: "SUPERWANDERER",
	    emoji: "0x1F69A",
	    title: "Super Roamin'",
        description: "This Player will Roam at the end of each Week and each Season."
	},
	{
	    id: "NEWADVENTURE",
	    emoji: "0x1F5FA",
	    title: "On an Odyssey",
        description: "This Player is boosted 2% every team they join a Team."
	},
	{
	    id: "SINKING_SHIP",
	    emoji: "0x1F6A2",
	    title: "Sinking Ship",
        description: "This Team plays 1% worse for every Player above 14 Players on their roster, and 1% better for every Player below 14 on their roster."
	},
	{
	    id: "PARASITE",
	    emoji: "0x1F99F",
	    title: "Parasite",
        description: "When this pitcher strikes out a batter in Blooddrain, they'll drain some blood from them."
	},
	{
	    id: "DEFECTOR",
	    emoji: "0x1F47E",
	    title: "Defector",
        description: "This Player will switch to the opponent's roster when the game ends."
	},
	{
	    id: "HOMEBODY",
	    emoji: "0x1F3E1",
	    title: "Homebody",
        description: "This Player will Overperform when playing in their home Ballpark and Underperform otherwise."
	},
	{
	    id: "KILLER_PIES",
	    emoji: "0x1F967",
	    title: "Flying Pie",
        description: "Whenever this Team has lost 3 games in a Row, their pitchers will start throwing Pies."
	},
	{
	    id: "FRESH",
	    emoji: "0x1F9FC",
	    title: "Fresh",
        description: "When a Player joins this Team, they'll be boosted by 2%."
	},
	{
	    id: "PARTING_GIFT",
	    emoji: "0x1F48C",
	    title: "Parting Gift",
        description: "When a Player leaves this Team, they'll be boosted by 2%."
	},
	{
	    id: "BLOCKED_BOOST",
	    emoji: "0x1F3A7",
	    title: "Blocked Boost",
        description: "If this Player is protected from a Steal or Swap Will, they'll be boosted by 2%."
	},
	{
	    id: "HALL_EXIT_BOOST",
	    emoji: "0x1FAB6",
	    title: "Phoenix",
        description: "When this Player exits the Hall of Flame, they'll be boosted 10% to 20%."
	},
	{
	    id: "FLOOD_PUMPS",
	    emoji: "0x1F6B0",
	    title: "Flood Pumps",
        description: "Flood Pumps will prevent Flooding weather from making your Ballpark filthier."
	},
	{
	    id: "POLAR_VORTEX",
	    emoji: "0x1F976",
	    title: "Polar Vortex",
        description: ""
	},
	{
	    id: "SALMON_CANNONS",
	    emoji: "0x1F41F",
	    title: "Salmon Cannons",
        description: "Salmon Cannons have a chance of expelling pests from your Ballpark."
	},
	{
	    id: "EVENT_HORIZON",
	    emoji: "0x1F30C",
	    title: "Event Horizon",
        description: "The Event Horizon will prevent the first Black Hole activation in each game, converting the Overflow to Unruns for your opponent's next game."
	},
	{
	    id: "SOUNDSYSTEM",
	    emoji: "0x1F50A",
	    title: "LCD Soundsystem",
        description: "The LCD Soundsystem will boost both Player involved in a Feedback swap by 5%."
	},
	{
	    id: "ECHO_CHAMBER",
	    emoji: "0x1F4E3",
	    title: "Echo Chamber",
        description: "In Reverb, Echo Chambers will occasionally provide Reverberating and Repeating modifications to Player for game-long use."
	},
	{
	    id: "FIRE_INSURANCE",
	    emoji: "0x1F9F2",
	    title: "Heat Magnet",
        description: "The Heat Magnet will absorb heat from an incineration and pass it on to the Thermal Converter."
	},
	{
	    id: "PEANUT_MISTER",
	    emoji: "0x1F95C",
	    title: "Peanut Mister",
        description: "A Peanut Mister will occasionally cure a Player of their peanut allergy.",
        descriptions: {
            ballpark: "A Peanut Mister will occasionally cure a Player in this Ballpark of their peanut allergy.",
            league: "A Peanut Mister will occasionally cure a Player of their peanut allergy."
        }
	},
	{
	    id: "BLOOD_LUSTER",
	    emoji: "0x1FA78",
	    title: "Blood Luster",
        description: ""
	},
	{
	    id: "BIRDHOUSES",
	    emoji: "0x1F426",
	    title: "Birdhouses",
        description: "Birdhouses invite Birds to come live in your Ballpark."
	},
	{
	    id: "SWEETENER",
	    emoji: "0x1F36D",
	    title: "Sweetener",
	    description: "Sweetener makes Beanings & Free Refills more likely in Coffee & Coffee Two weathers, and lowers the chance of losing Triple Threat."
	},
	{
	    id: "SECRET_BASE",
	    emoji: "0x1F6AA",
	    title: "Secret Base",
        description: "The Secret Base is a hidden base beyond 2nd that allows a baserunner to hide between innings."
	},
	{
	    id: "HOOPS",
	    emoji: "0x1F3C0",
	    title: "Hoops",
        description: "When a Player hits a Home Run, the next batter can go up for an alley oop to score an extra Run.",
        descriptions: {
            ballpark: "When a Player hits a Home Run in this Ballpark, the next batter can go up for an alley oop to score an extra Run.",
            player: "When a Player hits a Home Run, the next batter can go up for an alley oop to score an extra Run."
        }
	},
	{
	    id: "GRIND_RAIL",
	    emoji: "0x1F6F9",
	    title: "Grind Rail",
        description: "The Grind Rail allows a chance to steal directly from first base to third base, as long as they have the skills.",
        descriptions: {
            ballpark: "Players in this Ballpark can use the Grind Rail to steal directly from first base to third base, as long as they have the skills.",
            league: "Players can use the Grind Rail to steal directly from first base to third base, as long as they have the skills."
        }
	},
	{
	    id: "CASINO_ZONE",
	    emoji: "0x1F3B0",
	    title: "Casino Zone",
        description: "777"
	},
	{
	    id: "CATAPULTS",
	    emoji: "0x1F320",
	    title: "Catapults",
        description: ""
	},
	{
        id: "BIG_BUCKET",
	    emoji: "0x1FAA3",
        title: "Big Buckets",
        description: "If a home run lands in a Big Bucket, it scores an extra Run.",
        descriptions: {
            ballpark: "Home runs in this Ballpark have a chance of landing in a Big Bucket, which scores an extra Run.",
            league: "Home runs have a chance of landing in a Big Bucket, which scores an extra Run."
        }
    },
    {
        id: "SMALL_BUCKET",
	    emoji: "0x1F5D1",
        title: "Small Bucket",
        description: "If a home run lands in a Small Bucket, it score 5 extra Runs."
    },
    {
        id: "BULLPEN",
	    emoji: "0x1F402",
        title: "Bull Pen",
        description: ""
    },
    {
        id: "SEARCHLIGHTS",
	    emoji: "0x1F526",
        title: "Searchlights",
        description: ""
    },
    {
        id: "SECRET_TUNNELS",
	    emoji: "0x26CF",
        title: "Tunnels",
        description: "Tunnels allow the Home Team to steal from the Away Team in this Ballpark."
    },
    {
        id: "SOLAR_PANELS",
	    emoji: "0x2600",
        title: "Solar Panels",
        description: "Solar Panels will prevent the first Sun 2 activation in each game, converting the Overflow to Runs for your Team's next game."
    },
    {
        id: "TEMP_STOLEN",
	    emoji: "0x1F90F",
        title: "Stolen",
        description: "This Player has been temporarily stolen."
    },
    {
        id: "REDACTED",
	    emoji: "0x1F4C1",
        title: "Redacted",
        description: "This Player is Redacted."
    },
    {
        id: "FUGITIVE",
	    emoji: "0x1F463",
        title: "Fugitive",
        description: "This Player is at risk of being caught by Searchlights."
    },
    {
        id: "BIG_RED_BUTTON",
	    emoji: "0x1F386",
        title: "Supercharged",
        description: "When this Team hits a Grand Slam, reset the number of Outs to zero."
    },
    {
        id: "BASE_DEALING",
	    emoji: "0x1F0CF",
        title: "Base Dealing",
        description: "This Team's lineup will advance in reverse order."
    },
    {
        id: "SMOOTH",
	    emoji: "0x1F9C8",
        title: "Smooth",
        description: "This Player will have 100% more Speed in Peanut weather."
    },
    {
        id: "CHUNKY",
	    emoji: "0x1F330",
        title: "Chunky",
        description: "This Player will have 100% more Power in Peanut weather."
    },
    {
        id: "SUN_KISSED",
	    emoji: "0x2600",
        title: "Sun Dialed",
        description: "When this Team activates Sun 2, a random Player on their Team will be boosted by 1%."
    },
    {
        id: "UNHOLEY",
	    emoji: "0x26AB",
        title: "Unholey",
        description: "When this Team activates the Black Hole, a random Player on their opponent's Team will be impaired by 1%."
    },
    {
        id: "SUPERCHARGED",
	    emoji: "0x1F329",
        title: "Supercharged",
        description: "This Team will play 10% better after scoring 10+ Runs the Day before."
    },
    {
        id: "HIGH_PRESSURE",
	    emoji: "0x26F2",
        title: "High Pressure",
        description: "This Team or Player will play 25% better in Flooding weather when runners are on base.",
        descriptions: {
            player: "This Player will play 25% better in Flooding weather when runners are on base.",
            team: "This Team will play 25% better in Flooding weather when runners are on base."
        }
    },
    {
        id: "SCATTERED",
	    emoji: "0x1F32B",
        title: "Scattered",
        description: "This Player returned from Elsewhere a bit Scattered.",
        descriptions: {
            player: "This Player returned from Elsewhere a bit Scattered.",
            team: "This Team is Scattered across the Desert."
        }
    },
    {
        id: "PATIENT",
	    emoji: "0x1F440",
        title: "Patient",
        description: "This Player will never swing when there are 0 Strikes and are 1 Ball away from a Walk."
    },
    {
        id: "UNCERTAIN",
	    emoji: "0x1F3B2",
        title: "Uncertain",
        description: "When this Player returns from Elsewhere, they'll be adjusted by -15% to +20%."
    },
    {
        id: "MUNCHIES",
	    emoji: "0x1F36A",
        title: "Munchies",
        description: ""
    },
    {
        id: "DOUBLE_DOG",
	    emoji: "0x1F436",
        title: "Double-Dog",
        description: ""
    },
    {
        id: "BLACKHOLE_PAYOUTS",
	    emoji: "0x1F36E",
        title: "Jam-Packed",
        description: "When this Team triggers the Black Hole, they'll earn double payouts for all Wet Pretzel holders."
    },
    {
        id: "SUN2_PAYOUTS",
	    emoji: "0x1F369",
        title: "Glazed",
        description: "When this Team activates Sun 2, they'll earn double payouts for all Doughnut holders."
    },
    {
        id: "POPCORN_PAYOUTS",
	    emoji: "0x1F37F",
        title: "Buttered Up",
        description: "This Team earns double payouts on Popcorn."
    },
    {
        id: "STALEPOPCORN_PAYOUTS",
	    emoji: "0x1F9C2",
        title: "Over Salted",
        description: "This Team earns double payouts on Stale Popcorn."
    },
    {
        id: "MAXIMALIST",
	    emoji: "0x1F53C",
        title: "Maximalist",
        description: "This Player plays 250% better at Maximum Blaseball.",
        descriptions: {
            player: "This Player plays 250% better at Maximum Blaseball.",
            team: "This Team plays 250% better at Maximum Blaseball."
        }
    },
    {
        id: "MINIMALIST",
	    emoji: "0x1F53D",
        title: "Minimalist",
        description: "This Player plays 75% worse at Maximum Blaseball.",
        descriptions: {
            player: "This Player plays 75% worse at Maximum Blaseball.",
            team: "This Team plays 75% worse at Maximum Blaseball."
        }
    },
    {
        id: "FREE_WILL",
	    emoji: "0x1F4DC",
        title: "Free Will",
        description: "This Team will receive an Extra Will in the upcoming Election."
    },
	{
	    id: "FREE_GIFT",
	    emoji: "0x1F381",
	    title: "Free Gift",
	    description: "This Team will receive an Extra Gift from the next Gift Shop."
	},
    {
        id: "CUSTOM_HATCHED",
	    emoji: "0x1F423",
        title: "Custom Hatched",
        description: "This Player was hatched via Bird Rights."
    },
    {
        id: "FORCE",
	    emoji: "0x2693",
        title: "Force",
        description: "This Player is Forced into position. They cannot leave their current Location.",
        descriptions: {
            player: "This Player is Forced into position. They cannot leave their current Location.",
            team: "This Team is Forced into position. They cannot leave their current Location."
        }
    },
    {
        id: "PSYCHOACOUSTICS",
	    emoji: "0x1F4E1",
        title: "PsychoAcoustics",
        description: "In Feedback or Reverb, PsychoAcoustics will occasionally Echo one of the Away Team's mods to the Home Team, for game-long use."
    },
	{
        id: "CRIME_SCENE",
	    emoji: "0x1F50D",
        title: "Crime Scene",
        description: "When a Hard-Boiled Player plays at a Crime Scene, they'll Investigate."
    },
	{
        id: "AFTER_PARTY",
	    emoji: "0x1F973",
        title: "Afterparty",
        description: "This Team will occasionally receive permanent stats boost in their games (outside of Party Time), but only while they're losing."
    },
    {
        id: "MIDDLING",
	    emoji: "0x2195",
        title: "Middling",
        description: "This Team or Player will Overperform in the Midseason.",
        descriptions: {
            player: "This Player will Overperform in the Midseason.",
            team: "This Team will Overperform in the Midseason."
        }
    },
    {
        id: "0",
	    emoji: "0️⃣",
        title: "0",
        description: "Players with 0 will always swing at strikes while there are 0 Balls and 0 Strikes in the At Bat.",
        descriptions: {
            player: "This Player will always swing at strikes while there are 0 Balls and 0 Strikes in the At Bat.",
            team: "Players batting for this Team will always swing at strikes while there are 0 Balls and 0 Strikes in the At Bat."
        }
    },
    {
        id: "H20",
	    emoji: "0x1F4A7",
        title: "H20",
        description: "Players with H20 will always swing at strikes while there are 2 Outs.",
        descriptions: {
            player: "This Player will always swing at strikes while there are 2 Outs.",
            team: "Players batting for this Team will always swing at strikes while there are 2 Outs."
        }
    },
    {
        id: "ATTRACTOR",
	    emoji: "0x1F9F2",
        title: "Attractor",
        description: "When this Player scores a Run, they'll join the Shadows of the Team that scored them, if they're not already on their Roster."
    },
    {
        id: "SCRAMBLED",
	    emoji: "0x1F373",
        title: "Scrambled",
        description: "This Player is Scrambled."
    },
    {
        id: "CAREFUL",
	    emoji: "0x26A0",
        title: "Careful",
        description: "This Player's Items will not be damaged by standard game actions."
    },
    {
        id: "AMBITIOUS",
	    emoji: "0x1F451",
        title: "Ambitious",
        description: "This Team or Player will Overperform in the Postseason.",
        descriptions: {
            player: "This Player will Overperform in the Postseason.",
            team: "This Team will Overperform in the Postseason."
        }
    },
    {
        id: "PRO_SKATER",
        emoji: "0x1F6F9",
        title: "Pro Skater",
        description: "This Player cannot bail when using the Grind Rail."
    },
    {
        id: "PSYCHIC",
	    emoji: "0x1F944",
        title: "Psychic",
        description: "Psychic players have a chance of reversing a bad outcome with a Mind Trick.",
        descriptions: {
            player: "This Player has a chance of reversing a bad outcome with a Mind Trick.",
            team: "Players playing for this Team have a chance of reversing a bad outcome with a Mind Trick."
        }
    },
    {
        id: "FIERY",
	    emoji: "0x1F525",
        title: "Fiery",
        description: "Players with Fiery have a chance of throwing Double Strikes.",
        descriptions: {
            player: "This Player has a chance of throwing Double Strikes.",
            team: "Players pitching for this Team have a chance of throwing Double Strikes."
        }
    },
    {
        id: "AAA",
	    emoji: "0x1F50B",
        title: "Power Chaaarge",
        description: "When this Player hits a Triple, they'll have a chance of Overperforming for the rest of the game.",
        descriptions: {
            player: "When this Player hits a Triple, they'll have a chance of Overperforming for the rest of the game.",
            team: "When a Player batting for this Team hits a Triple, they'll have a chance of Overperforming for the rest of the game."
        }
    },
    {
        id: "UNAMBITIOUS",
	    emoji: "0x1F9F1",
        title: "Unambitious",
        description: "This Team or Player will Underperform in the Postseason.",
        descriptions: {
            player: "This Player will Underperform in the Postseason.",
            team: "This Team will Underperform in the Postseason."
        }
    },
    {
        id: "COASTING",
	    emoji: "0x26F5",
        title: "Coasting",
        description: "This Team or Player will Underperform in the Midseason.",
        descriptions: {
            player: "This Player will Underperform in the Midseason.",
            team: "This Team will Underperform in the Midseason."
        }
    },
    {
        id: "FLOOD_BATH",
	    emoji: "0x1F6C1",
        title: "Flood Bath",
        description: "When Runners on this Team are cleared via Flooding, they'll become Slippery for the remainder of the game."
    },
    {
        id: "SLIPPERY",
	    emoji: "0x1F4A6",
        title: "Slippery",
        description: "When a Slippery baserunner scores, and first base is available, they'll slide to first after scoring."
    },
    {
        id: "HOTEL_MOTEL",
        emoji: "0x1F3E2",
        title: "Hotel Motel",
        description: "The Hotel Motel will occasionally create Holiday Innings during the Earlseason, where you Party instead of Score.",
        descriptions: {
            ballpark: "The Hotel Motel will occasionally create Holiday Innings during the Earlseason, where you Party instead of Score.",
            league: "Holiday Innings will occasionally happen during the Earlseason, where Teams Party instead of score."
        }
    },
    {
        id: "FAX_MACHINE",
        emoji: "0x1F4E0",
        title: "Fax Machine",
        description: "The Fax Machine will swap the Home Team's pitcher for their best Shadows Pitcher whenever they've allowed 10+ Runs in a game."
    },
	{
        id: "ENTANGLED",
	    emoji: "0x1F9F6",
        title: "Entangled",
        description: "Whenever this Player would return from Elsewhere, their Alternate will return instead.",
        descriptions: {
            team: "Whenever this Team would return from Elsewhere, their Alternate will return instead.",
            player: "Whenever this Player would return from Elsewhere, their Alternate will return instead."
        }
    },
    {
        id: "OFFWORLD",
	    emoji: "0x1FA90",
        title: "Offworld",
        description: "When this Player hits a foul ball, it will fly Offworld."
    },
    {
        id: "ACIDIC",
	    emoji: "0x1F9EA",
        title: "Acidic",
        description: "Acidic pitchers occasionally throw Acidic pitches, which cause any Runs scored on the play to be worth .1 less.",
        descriptions: {
            player: "This Player will occasionally throw Acidic pitches, which cause any Runs scored on the play to be worth .1 less.",
            team: "Players pitching for this Team will occasionally throw Acidic pitches, which cause any Runs scored on the play to be worth .1 less."
        }
    },
    {
        id: "AA",
	    emoji: "0x1F50C",
        title: "Power Chaarge",
        description: "When this Player hits a Double, they'll have a chance of Overperforming for the rest of the game.",
        descriptions: {
            player: "When this Player hits a Double, they'll have a chance of Overperforming for the rest of the game.",
            team: "When a Player batting for this Team hits a Double, they'll have a chance of Overperforming for the rest of the game."
        }
    },
    {
        id: "SMITHY",
	    emoji: "0x1F528",
        title: "Smithy",
        description: "The Smithy will occasionally repair Items for Players playing in this Ballpark.",
        descriptions: {
            ballpark: "The Smithy will occasionally repair Items for Players playing in this Ballpark.",
            league: "The Smithy will occasionally repair Items during games."
        }
    },
    {
        id: "COVERUP",
	    emoji: "0x1F910",
        title: "Cover Up",
        description: "This Player is covering something up."
    },
    {
        id: "REPLICA",
	    emoji: "0x1F916",
        title: "Replica",
        description: "This Player will fade to Dust at the end of the Season."
    },
    {
        id: "DUST",
	    emoji: "0x26B1",
        title: "Dust",
        description: "This Player is waiting to be Dusted off."
    },
    {
        id: "RALLY",
	    emoji: "0x1F3C1",
        title: "Rally",
        description: "This Team or Player will play 5% better when losing in the 7th inning or later.",
        descriptions: {
            player: "This Player will play 5% better when losing in the 7th inning or later.",
            team: "This Team will play 5% better when losing in the 7th inning or later."
        }
    },
    {
        id: "NIGHT_VISION",
	    emoji: "0x1F97D",
        title: "Night Vision",
        description: "This Player will play 50% better in Solar Eclipse weather."
    },
    {
        id: "NEGATIVE",
	    emoji: "0x1F4F7",
        title: "Negative",
        description: "This Player is a Negative."
    },
    {
        id: "OPEN_FLOOR_PLAN",
	    emoji: "0x1F3DE",
        title: "Open Floor Plan",
        description: "This Ballpark's Grandiosity is 5% the eDensity of a standard Ballpark."
    },
    {
        id: "INTUITIVE",
	    emoji: "0x1F9E0",
        title: "Intuitive",
        description: "This Player's pitching will be boosted 10% when switching from Lineup to Rotation, and their hitting will be boosted 10% when switching from Rotation to Lineup."
    },
    {
        id: "UNDEFINED",
	    emoji: "0x203C",
        title: "Undefined",
        description: "This Player will play 50-100% better while Scattered."
    },
    {
        id: "SLOW_BUILD",
	    emoji: "0x1F3D7",
        title: "Slow Build",
        description: "This Player will bat 1% better for each subsequent At Bat they have in a game."
    },
    {
        id: "GRAPHENE",
	    emoji: "0x1F3DF",
        title: "Graphene",
        description: "This Ballpark's Fortifications are 5% the eDensity of a standard Ballpark."
    },
    {
        id: "A",
	    emoji: "0x1F170",
        title: "A Blood Type",
        description: "A Team or Player with A Blood Type will play each game with a random Blood type ability."
    },
    {
        id: "GOOD_RIDDANCE",
	    emoji: "0x1F44B",
        title: "Good Riddance",
        description: "This Team will throw a Party when a Roamin' or Super Roamin' player leaves their roster."
    },
    {
        id: "TURNTABLES",
	    emoji: "0x1F4BF",
        title: "Turntables",
        description: "Any Win earned from a non-loss in this Ballpark during the Regular Season will be converted to an Unwin.",
        descriptions: {
            ballpark: "Any Win earned from a non-loss in this Ballpark during the Regular Season will be converted to an Unwin.",
            league: "Any Win earned from a non-loss during the Regular Season will be converted to an Unwin."
        }
    },
    {
        id: "UNDERTAKER",
	    emoji: "0x26B0",
        title: "Undertaker",
        description: "This Player will dive in to Develop a Negative when a teammate goes Elsewhere."
    },
    {
        id: "SEEKER",
	    emoji: "0x1F9ED",
        title: "Seeker",
        description: "The Player has a chance to bring teammates back from Elsewhere."
    },
	{
	    id: "SUBTRACTOR",
	    emoji: "0x1F69C",
	    title: "Subtractor",
	    description: "When this Player bats in a Run or Unrun, the polarity of the Run or Unrun will be flipped (Runs become Unruns, Unruns become Runs)."
	},
	{
	    id: "UNDERACHIEVER",
	    emoji: "0x1F9A5",
	    title: "Underachiever",
	    description: "When this Player hits a Home Run, the polarity of the Runs or Unruns will be flipped (Runs become Unruns, Unruns become Runs)."
	},
	{
	    id: "UNDERHANDED",
	    emoji: "0x1F932",
	    title: "Underhanded",
	    description: "When this Pitcher allows a Home Run, the polarity of the Runs or Unruns will be flipped (Runs become Unruns, Unruns become Runs)."
	},
	{
	    id: "MODERATION",
	    emoji: "0x1F90F",
	    title: "Moderation",
	    description: "This Team will accept Unruns after each non-loss so that they only non-lose by 1 Run."
	},
	{
	    id: "GAUDY",
	    emoji: "0x1F48E",
	    title: "Gaudy",
	    description: "This Player will play better in Ballparks with more Modifications."
	},
	{
	    id: "GUARDED",
	    emoji: "0x1F3DB",
	    title: "Guarded",
	    description: "This Player will play better in more Fortified Ballparks, and worse in less Fortified Ballparks."
	},
	{
	    id: "CLUTTERED",
	    emoji: "0x1F4DA",
	    title: "Cluttered",
	    description: "This Player will play better in Filthier Ballparks."
	},
	{
	    id: "OUTDOORSY",
	    emoji: "0x1F3D5",
	    title: "Outdoorsy",
	    description: "This Player will play better in more Grandiose Ballparks, and worse in less Grandiose Ballparks."
	},
	{
	    id: "YOLKED",
	    emoji: "0x1F4AA",
	    title: "Yolked",
	    description: "This Player is Yolked!"
	},
	{
	    id: "FIREWALKER",
	    emoji: "0x1F9E8",
	    title: "Firewalker",
	    description: "When this Player leaves a Location, they'll leave Instability behind."
	},
	{
	    id: "STRANGE_ATTRACTOR",
	    emoji: "0x1F9F2",
	    title: "Strange Attractor",
	    description: "When this player scores a Run, they'll join the Active Roster of a random other Team in the League."
	},
	{
	    id: "SUNSUN",
	    emoji: "0x1F305",
	    title: "Sun(Sun)",
	    description: "All Wins and Unwins earned will be Squared.",
	    descriptions: {
		    league: "All Wins and Unwins earned will be Squared.",
		    ballpark: "All Wins and Unwins earned in this Ballpark will be Squared.",
		    team: "All Wins and Unwins earned by this Team will be Squared."
		}
	},
    {
        id: "AIR_BALLOONS",
	    emoji: "0x1F388",
        title: "Air Balloons",
        description: "A small, permanent amount of negative eDensity is added for each Run or Win earned in this Ballpark."
    },
    {
        id: "VERY_FOUL_BALLS",
	    emoji: "0x1F7E1",
        title: "Ball Pit",
        description: "Every Foul Ball hit in this Ballpark will add 5x the eDensity that it normally would."
    },
    {
        id: "HOT_AIR_BALLOONS",
	    emoji: "0x1F3EE",
        title: "Hot Air Balloons",
        description: "A large, permanent amount of negative eDensity is added for each Incineration in this Ballpark."
    },
    {
        id: "CONDENSED_FLOOR_PLAN",
	    emoji: "0x1F3D9",
        title: "Condensed Floor Plans",
        description: "Grandiosity is 5x more eDense than usual in this Ballpark."
    },
    {
        id: "ANTIGRAPHENE",
	    emoji: "0x26F0",
        title: "Antigraphene",
        description: "Fortifications are 5x more eDense than usual in this Ballpark."
    },
    {
        id: "THIEVES_GUILD",
	    emoji: "0x1F978",
        title: "Phantom Thieves' Guild",
        description: "If the Home Team loses by 9 Runs in this Ballpark, they will steal from their opponent's Shadows."
    },
    {
        id: "GREEN_LIGHT",
	    emoji: "0x1F7E2",
        title: "Green Light",
        description: "This Player will play 50% better in Positive Polarity (+) Weather and 50% worse in Negative Polarity (-) Weather."
    },
    {
        id: "HEAVY_HANDED",
	    emoji: "0x1F9BE",
        title: "Heavy-Handed",
        description: "All Items held by Players on this Team have positive eDensity."
    },
    {
        id: "LIGHT_HANDED",
	    emoji: "0x270B",
        title: "Light-Handed",
        description: "All Items held by Players on this Team have negative eDensity."
    },
    {
        id: "SPONGE",
	    emoji: "0x1F9FD",
        title: "Sponge",
        description: "Floods will be much more likely when this Player is on base."
    },
    {
        id: "MAGNIFY_2X",
	    emoji: "0x274E",
        title: "2x",
        description: "Every Run that this Player bats in or allows will be multiplied by 2.",
        descriptions: {
            player: "Every Run that this Player bats in or allows will be multiplied by 2.",
            team: "Every Run that this Team bats in or allows will be multiplied by 2."
        }
    },
    {
        id: "MAGNIFY_3X",
	    emoji: "0x274E",
        title: "3x",
        description: "Every Run that this Player bats in or allows will be multiplied by 3.",
        descriptions: {
            player: "Every Run that this Player bats in or allows will be multiplied by 3.",
            team: "Every Run that this Team bats in or allows will be multiplied by 3."
        }
    },
    {
        id: "MAGNIFY_4X",
	    emoji: "0x274E",
        title: "4x",
        description: "Every Run that this Player bats in or allows will be multiplied by 4.",
        descriptions: {
            player: "Every Run that this Player bats in or allows will be multiplied by 4.",
            team: "Every Run that this Team bats in or allows will be multiplied by 4."
        }
    },
    {
        id: "MAGNIFY_5X",
	    emoji: "0x274E",
        title: "5x",
        description: "Every Run that this Player bats in or allows will be multiplied by 5.",
        descriptions: {
            player: "Every Run that this Player bats in or allows will be multiplied by 5.",
            team: "Every Run that this Team bats in or allows will be multiplied by 5."
        }
    },
    {
        id: "PROFIT",
	    emoji: "0x1F4C8",
        title: "Profit",
        description: "This Player pays out 10x the rewards for all Idol Snacks."
    },
    {
        id: "NONPROFIT",
	    emoji: "0x1F4C9",
        title: "Non-Profit",
        description: "This Player does not pay out Snack rewards to Fans of their own Team."
    },
    {
        id: "NIGHTSHADE",
	    emoji: "0x1F303",
        title: "Nightshade",
        description: "This Team plays 20% better in Night Weather."
    },
    {
        id: "TRADER",
	    emoji: "0x1F500",
        title: "Trader",
        description: "This Player has a chance of swapping Items with an opponent during a game."
    },
    {
        id: "TRAITOR",
	    emoji: "0x267B",
        title: "Traitor",
        description: "This Player has a chance of swapping Items with a teammate during a game."
    },
    {
        id: "BIRD_HOTEL",
	    emoji: "0x1F3E8",
        title: "Bird Hotel",
        description: "When the Home Team parties, a number of Birds will come join the Party."
    },
    {
        id: "FLOOD_BALLOONS",
	    emoji: "0x1F3D0",
        title: "Flood Balloons",
        description: "A medium, permanent amount of negative eDensity is added for each Flood in this Ballpark."
    },
    {
        id: "ANTI_FLOOD_PUMPS",
	    emoji: "0x1F6B1",
        title: "Anti Flood Pumps",
        description: "Whenever a Flood happens in this Ballpark, its Filthiness is greatly increased."
    },
    {
        id: "VOICEMAIL",
	    emoji: "0x1F4DF",
        title: "Voicemail",
        description: "When the Home Team is shut out in this Ballpark, they'll swap the worst Batter in their Lineup with the best Batter in their Shadows."
    },
    {
        id: "HEIST_EXPERT",
	    emoji: "0x1F978",
        title: "Heist Expert",
        description: "This Player is adept at using a Ballpark's Tunnels.",
        descriptions: {
            team: "This Team is adept at using a Ballpark's Tunnels.",
            player: "This Player is adept at using a Ballpark's Tunnels."
        }
    },
    {
        id: "PROTOTYPE",
	    emoji: "0x1F9BF",
        title: "Prototype",
        description: "This Team's Postseason Births will arrive with a random modification."
    },
    {
        id: "SKIPPING",
	    emoji: "0x1F4BD",
        title: "Skipping",
        description: "When this Player steps up to bat, they'll start with a randomized count."
    },
    {
        id: "RELOAD",
	    emoji: "0x1F4BE",
        title: "Reload",
        description: "When this Player hits a Grand Slam, they'll reload the bases."
    },
    {
        id: "SUN_STARING",
	    emoji: "0x1F60E",
        title: "Sun Staring",
        description: "Whenever another Team in the League activates Sun 2, this Team will gain .1 Runs (in their current game, or saved for next game)."
    },
    {
        id: "SOFT_SHELLED",
	    emoji: "0x1F41A",
        title: "Soft Shelled",
        description: "Shelled Players on this Team will play, 20% better."
    },
    {
        id: "WAVE_POOL",
	    emoji: "0x1F3CA",
        title: "Wave Pool",
        description: "This Player is a Wave Pool."
    },
    {
        id: "CYCLING",
	    emoji: "0x1F6B2",
        title: "Cycling",
        description: "Pitchers cycle out at the end of every inning."
    },
    {
        id: "FORGERY",
	    emoji: "0x1F5BC",
        title: "Forgery",
        description: "When Players join this Team, they will be Artificially Forged."
    },
    {
        id: "CLIMATE_CONTROL",
	    emoji: "0x1F321",
        title: "Climate Control",
        description: "The Weather will change every inning in this Ballpark."
    },
    {
        id: "WEATHER_REPORTS",
	    emoji: "0x26C5",
        title: "Weather Reports",
        description: "When the Weather changes in this Ballpark, it will pick based on \"History\"."
    },
    {
        id: "ROAMLESS",
	    emoji: "0x26D4",
        title: "Roamless",
        description: "Players cannot Roam to this Team."
    },
    {
        id: "AVOIDANCE",
	    emoji: "0x1F6D1",
        title: "Avoidance",
        description: "This Team will not swing with 9+ Runs."
    },
    {
        id: "STEELED",
	    emoji: "0x2694",
        title: "Steeled",
        description: "This Player has Steeled themselves against incoming attacks."
    },
    {
        id: "STABLES",
	    emoji: "0x1F40E",
        title: "Stables",
        description: "When any Team scores 25+ in this Ballpark, any Instability in the Ballpark will be stabled."
    },
    {
        id: "MINIMIZED",
	    emoji: "0x1F6BC",
        title: "Minimized",
        description: "This Player has been Minimized."
    },
    {
        id: "UNDER_REVIEW",
	    emoji: "0x1F4CB",
        title: "Under Review",
        description: "This Team is Under Review..."
    },
    {
        id: "SUPERNOVA",
	    emoji: "0x1F31F",
        title: "Sun(Sun) Supernova",
        description: ""
    },
    {
        id: "SMBH",
	    emoji: "0x1F533",
        title: "Black Hole (Black Hole)",
        description: ""
    },
    {
        id: "PULSAR",
	    emoji: "0x23FA",
        title: "Pulsar (Pulsar)",
        description: ""
    },
    {
        id: "ROGUE",
	    emoji: "🏴‍☠️",
        title: "Rogue",
        description: "This Team is Out for a Surprise Attack."
    },
    {
        id: "FROZEN",
	    emoji: "0x1F976",
        title: "Frozen",
        description: "This Player is frozen, and cannot play."
    },
    {
      id: "UNFREEZABLE",
      emoji: "0x1F427",
      title: "Unfreezable",
      description: "This Player cannot be Frozen."
    }
]