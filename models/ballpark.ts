import { ChroniclerEntity, ChroniclerBallpark } from "@models/chronicler"
import { ballparkColumns, getReverseAttributes } from "@models/columns"
import Team from "@models/team"

export const ballparkAttributeIds = ballparkColumns.find((category) => category.id === "stats")?.columns.map((column) => column.id) ?? []
export const reverseBallparkAttributes = getReverseAttributes(ballparkColumns)

const weathers = [
	{ 
		name: "Void",
    	background: "#67678a",
    	color: "#000000",
    	description: "No chance of nothing.",
		emoji: "0x2754",
	},
	{ 
		name: "Sun 2",
    	background: "#fdff9c",
    	color: "#ffffff",
    	description: "When a team collects 10 Runs, Sun 2 will collect the Runs, and set a Win upon that team.",
		emoji: "0x2600",
	},
	{ 
		name: "Overcast",
    	background: "#cfcfcf",
    	color: "#737373",
    	description: "A bit cloudy.",
		emoji: "0x26C5",
	},
	{ 
		name: "Rainy",
    	background: "#348e9e",
    	color: "#0727a8",
    	description: "",
		emoji: "0x1F327",
	},
	{ 
		name: "Sandstorm",
    	background: "#877652",
    	color: "#e0dac3",
    	description: "",
		emoji: "0x1F3D6",
	},
	{ 
		name: "Snow",
    	background: "#1F4F57",
    	color: "#ffffff",
    	description: "WINTER STORM WARNING",
		emoji: "0x2744",
	},
	{ 
		name: "Acidic",
    	background: "#92ad58",
    	color: "#235917",
    	description: "",
		emoji: "0x2697",
	},
	{ 
		name: "Solar Eclipse",
    	background: "#002f3b",
    	color: "#ffffff",
    	description: "A chance of incinerations.",
		emoji: "0x1F311",
	},
	{ 
		name: "Glitter",
    	background: "#ff94ff",
    	color: "#ffffff",
    	description: "A chance of sparkles.",
		emoji: "0x2728",
	},
	{ 
		name: "Blooddrain",
    	background: "#52050f",
    	color: "#ffffff",
    	description: "A chance of transfusions between players.",
		emoji: "0x1FA78",
	},
	{ 
		name: "Peanuts",
    	background: "#423519",
    	color: "#ffffff",
    	description: "Traces of salt and honey...",
		emoji: "0x1F95C",
	},
	{ 
		name: "Birds",
    	background: "#45235e",
    	color: "#ffffff",
    	description: "Birds have been to known to eat peanuts and are just generally great friends.",
		emoji: "0x1F426",
	},
	{ 
		name: "Feedback",
    	background: "#383838",
    	color: "#ffffff",
    	description: "A chance of player swaps between teams.",
		emoji: "0x1F3A4",
	},
	{ 
		name: "Reverb",
    	background: "#443561",
    	color: "#ffffff",
    	description: "A chance of roster shuffles.",
		emoji: "0x1F30A",
	},
	{ 
		name: "Black Hole",
    	background: "#000000",
    	color: "#ffffff",
    	description: "When a Team collects 10 Runs, Black Hole will swallow the Runs and burp at the opposing Team.",
		emoji: "0x26AB",
	},
	{ 
		name: "Coffee",
    	background: "#9a7b4f",
    	color: "#ffffff",
    	description: "Players may get Wired or Tired.",
		emoji: "0x2615",
	},
	{ 
		name: "Coffee 2",
    	background: "#0c4022",
    	color: "#ffffff",
    	description: "Players may get Free Refills.",
		emoji: "0x1F375",
	},
	{ 
		name: "Coffee 3s",
    	background: "#5fa9f1",
    	color: "#ffffff",
    	description: "Pitchers will become Triple Threats.",
		emoji: "3️⃣",
	},
    {
    	name: "Flooding",
    	background: "#465f63",
    	color: "#ffffff",
    	description: "An Accident.",
    	emoji: "0x1F93F",
    },
	{
		name: "Salmon",
    	background: "#ba7b97",
    	color: "#f2c7e3",
    	description: "Salmon have been known to swim Upstream.",
		emoji: "0x1F41F",
	},
	{
		name: "Polarity +",
    	background: "#042e16",
    	color: "#d3e3e2",
    	description: "Numbers go up.",
		emoji: "0x23EB",
	},
	{
		name: "Polarity -",
    	background: "#3b0422",
    	color: "#ff6be6",
    	description: "Numbers go down.",
		emoji: "0x23EC",
	},
    {
    	name: "???",
    	background: "#0e4e8a",
    	color: "#ffc400",
    	description: "???",
		emoji: "0x2753"
    },
    {
    	name: "Sun 90",
    	background: "#36001b",
    	color: "#ffc400",
    	description: "Scoring Plays are worth an extra Run for each Out.",
		emoji: "0x1F536",
    },
    {
    	name: "Sun .1",
    	background: "#36001b",
    	color: "#ffc400",
    	description: "Each Run scored is worth .1 more per inning.",
		emoji: "0x1F538",
    },
    {
    	name: "Sum Sun",
    	background: "#36001b",
    	color: "#ffc400",
    	description: "Each successive scoring play in a half inning is worth an extra Run.",
		emoji: "0x1F506",
    },
	{
    	name: "Supernova Eclipse",
    	background: "#36001b",
    	color: "#ffc400",
    	description: "",
		emoji: "0x1F31F",
    },
    {
    	name: "Black Hole (Black Hole)",
    	background: "#000000",
    	color: "#ffc400",
    	description: "",
		emoji: "0x1F533",
    },
    {
    	name: "Jazz",
    	background: "#0f592f",
    	color: "#000",
    	description: "louie-ooie-la-la-la; shoo-doo-shoo-bee-ooo-bee.",
		emoji: "0x1F3B7",
    },
    {
    	name: "Night",
    	background: "#000",
    	color: "#ff8d13",
    	description: "Deep dark.",
		emoji: "0x1F319",
    }
]

export default class Ballpark {
    public readonly id: string
    public readonly data: ChroniclerBallpark

    constructor(data: ChroniclerEntity<ChroniclerBallpark>) {
        this.id = data.entityId
        this.data = data.data
    }

    getStat(attribute: string): number | undefined {
        return ballparkAttributeIds.includes(attribute) ? {...this.data}[attribute] as number : undefined
    }

    filthiness(): string {
        if(this.data.filthiness < 0.25) {
            return "Getting Uncomfortable";
        } else if(this.data.filthiness < 0.5) {
            return "Uncomfortable";
        } else if(this.data.filthiness < 0.75) {
            return "Kind of Filthy";
        } else {
            return "Absolutely Filthy";
        }
    }

    hype(): string {
        if(this.data.hype < 0.25) {
            return "Pedestrian";
        } else if(this.data.hype < 0.5) {
            return "Minor";
        } else if(this.data.hype < 0.75) {
            return "Dope";
        } else if(this.data.hype < 0.99) {
            return "Major";
        } else {
            return "Peak";
        }
    }

    luxuriousness(): string {
        if(this.data.luxuriousness < 0.25) {
            return "Low";
        } else if(this.data.luxuriousness < 0.5) {
            return "Medium";
        } else if(this.data.luxuriousness > 0.75) {
            return "High";
        } else {
            return "Very High";
        }
    }

    prefab() {
        switch(this.data.model) {
            case 0:
                return {
					name: "Palermo",
					description: "Settle in. Why go anywhere when you could stay home?",
				}
            case 1:
                return {
					name: "Silverada",
					description: "The sleek lines and open space scream speed.",
				}
            case 2:
                return {
					name: "Douglas",
					description: "Keep your loved ones safe with the leader in home field security.",
				}
            case 3:
                return {
					name: "Hillcrest",
					description: "A high-energy space you'll want to sink into.",
				}
            case 4:
                return {
					name: "Twede",
					description: "Keep things in front of you in this minimalist dream.",
				}
            case 5:
                return {
					name: "Rodeo",
					description: "Everything's a long ball in this cozy space-saver.",
				}
            case 6:
                return {
					name: "Loge",
					description: "Open air and easy access make this the perfect event space.",
				}
            case 7:
                return {
					name: "Pine",
					description: "Pitchers will go absolutely wild over the view.",
				}
            case 8:
                return {
					name: "Boreal",
					description: "High ceilings, tons of natural light. You could get lost in your own home.",
				}
            default:
                return null
        }
    }

    weather() {
        const weather = []
        for(const index in this.data.weather) {
            const indexNum = parseInt(index)
            if(indexNum <= weathers.length) { 
                weather.push({
                    data: weathers[indexNum],
                    frequency: this.data.weather[index],
                })
            }
        }
        return weather
    }

    slug(): string {
        return this.data.name.toLowerCase().replace(/,/g, "-comma-").replace(/[.']+/g, "").replace(/[-\s]+/g, "-");
    }
}

function getComparatorValue(teams: Team[], ballpark: Ballpark, attribute: string) {
    switch(attribute) {
		case "airBalloons":
			return ballpark.data.state?.air_balloons ?? 0
		case "birds":
			return ballpark.data.birds ?? 0
		case "filthiness":
			return ballpark.data.filthiness
		case "floodBallons":
			return ballpark.data.state?.flood_balloons ?? 0
		case "hype":
			return ballpark.data.hype
		case "luxuriousness":
			return ballpark.data.luxuriousness
		case "modifications":
            return ballpark.data.mods.length
		case "name":
			return ballpark.data.nickname.startsWith("The ") ? ballpark.data.nickname.substring(4) : ballpark.data.nickname
		case "type":
			return ballpark.prefab()?.name ?? ""
		case "team":
			const team = teams.find((team) => team.id === ballpark.data.teamId)
			return team ? team.canonicalNickname() : ""
        case "weather":
            return ballpark.weather().reduce((sum, weather) => sum + weather.frequency, 0)
        default:
            return ballpark.getStat(attribute) ?? 0
    }
}

export const BallparkComparator = (teams: Team[], column: string, direction?: "asc" | "desc") => {
	return (ballpark1: Ballpark, ballpark2: Ballpark) => {
        let comparison = 0;
		let attribute1 = getComparatorValue(teams, ballpark1, column)
		let attribute2 = getComparatorValue(teams, ballpark2, column)
        if(attribute1 !== attribute2) {
            if (attribute1 > attribute2 || attribute1 === void 0) comparison = 1;
            if (attribute1 < attribute2 || attribute2 === void 0) comparison = -1;
        }
        comparison = attribute1 > attribute2 ? -1 : 1
        if(reverseBallparkAttributes.includes(column) && direction !== "desc") {
            comparison *= -1
        } else if(direction === "asc") {
            comparison *= -1
        }
		return comparison
	}
}