export const columns = {
    sibrmetrics: [
        {
            group: "lineup",
            id: "wobabr",
            name: "wOBA Batter Rating",
            shorthand: "wOBABR",
            weights: {
                divinity: 0.21,
                martyrdom: 0.07,
                moxie: 0.09,
                musclitude: 0.04,
                patheticism: 0.17,
                thwackability: 0.35,
                groundFriction: 0.06
            }
        },
        {
            group: "lineup",
            id: "slgbr",
            name: "Slugging Batter Rating",
            shorthand: "SLGBR",
            weights: {
                divinity: 0.25,
                musclitude: 0.13,
                patheticism: 0.11,
                thwackability: 0.37,
                groundFriction: 0.15
            }
        },
        {
            group: "lineup",
            id: "bsrr",
            name: "Base Running Rating",
            shorthand: "BsRR",
            weights: {
                baseThirst: 0.16,
                continuation: 0.21,
                indulgence: 0.06,
                laserlikeness: 0.58
            }
        },
        {
            group: "rotation",
            id: "erpr",
            name: "Earned Runs Pitcher Rating",
            shorthand: "ERPR",
            weights: {
                overpowerment: 0.1,
                ruthlessness: 0.74,
                unthwackability: 0.16
            }
        }
    ],
    categories: [
        {
            attributes: [
                {
                    description: "Appears to turn fielded outs specifically into flyouts. Countered by the opposing pitcher's suppression. Included in the batting stars calculation, but does not affect the output. Also represents vibe period in the vibe calculation formula.",
                    direction: "asc",
                    id: "buoyancy",
                    name: "Buoyancy",
                    shorthand: "float",
                    weight: 0
                },
                {
                    description: "Ability to hit home runs. This is boosted by \"Power\" blessings (eg. Ooze, Mushroom)",
                    direction: "asc",
                    id: "divinity",
                    name: "Divinity",
                    shorthand: "divin",
                    weight: 0.35
                },
                {
                    description: "Determines whether a batter ground out with a runner on base that has to advance, turns into a Fielder's Choice or if the runner(s) is/are able to advance on the out.",
                    direction: "asc",
                    id: "martyrdom",
                    name: "Martyrdom",
                    shorthand: "martyr",
                    weight: 0.02
                },
                {
                    description: "Represents \"plate discipline\" / drawing walks - determines how likely the player is to not swing at balls outside the strike zone.",
                    direction: "asc",
                    id: "moxie",
                    name: "Moxie",
                    shorthand: "moxie",
                    weight: 0.075
                },
                {
                    description: "<p>Appears to determine if a batter's hit turns into a double instead of a single and is used to determine if a batted ball turns into a foul.</p><p>Positively correlates to doubles, got a 10% boost on players affected by the +10% boost to Speed in the Season 6 election, as well as 10% from the Power buff, and is boosted by the Mushroom.</p>",
                    direction: "asc",
                    id: "musclitude",
                    name: "Musclitude",
                    shorthand: "muscl",
                    weight: 0.075
                },
                {
                    description: "Likelihood of the batter (not) making contact with the ball. Correlates with high strikeout rate, lower batting average, on-base percentage, and similar derived stats.",
                    direction: "desc",
                    id: "patheticism",
                    name: "Patheticism",
                    shorthand: "path",
                    weight: 0.05
                },
                {
                    description: "General \"quality of contact\" with the ball, higher thwackability reduces groundouts and flyouts and increases hits.",
                    direction: "asc",
                    id: "thwackability",
                    name: "Thwackability",
                    shorthand: "thwack",
                    weight: 0.35
                },
                {
                    description: "Tragicness is generated randomly, but used to get reset to exactly 0.1 at seemingly random points. Most current players have a tragicness of 0.1. The in-game effect of this is unknown. Allegedly linked to <code>shakespearianism</code>.",
                    direction: "desc",
                    id: "tragicness",
                    name: "Tragicness",
                    shorthand: "tragic",
                    weight: 0.01
                }
            ],
            group: "lineup",
            id: "batting",
            hasRating: true,
            name: "Batting"
        },
        {
            attributes: [
                {
                    description: "Unknown at this time, but there is weak signal that this is used in the stolen base rolls for a baserunner.",
                    direction: "asc",
                    id: "coldness",
                    name: "Coldness",
                    shorthand: "cold",
                    weight: 0.025
                },
                {
                    description: "Seems to reduce the power of batted balls - mainly lowers home runs, but seems to affect all types of hits.",
                    direction: "asc",
                    id: "overpowerment",
                    name: "Overpowerment",
                    shorthand: "op",
                    weight: 0.15
                },
                {
                    description: "How likely a pitch is to be inside the strike zone. Higher ruthlessness reduces walks and increases strikeouts. Along with <code>unthwackability</code>, is one of the primary components of pitcher performance.",
                    direction: "asc",
                    id: "ruthlessness",
                    name: "Ruthlessness",
                    shorthand: "ruth",
                    weight: 0.4
                },
                {
                    description: "Appears to convert fielder's choices into double plays. Allegedly linked to <code>tragicness</code>, according to <a href=\"https://www.youtube.com/watch?v=zO05p-e57AQ&t=1188s\">Joel</a>.",
                    direction: "asc",
                    id: "shakespearianism",
                    name: "Shakespearianism",
                    shorthand: "shakes",
                    weight: 0.1
                },
                {
                    description: "Appears to counter batter <code>buoyancy</code> and converts flyouts to ground outs.",
                    direction: "asc",
                    id: "suppression",
                    name: "Suppression",
                    shorthand: "supp",
                    weight: 0
                },
                {
                    description: "Lowers hits allowed, increases ground outs and flyouts. The \"counter\" to batter <code>thwackability</code>.",
                    direction: "asc",
                    id: "unthwackability",
                    name: "Unthwackability",
                    shorthand: "unthwk",
                    weight: 0.5
                }
            ],
            group: "rotation",
            id: "pitching",
            hasRating: true,
            name: "Pitching"
        },
        {
            attributes: [
                {
                    description: "Determines likelihood of base stealing attempts, although not necessarily success rate. A player with high base thirst but low <code>laserlikeness</code> will get caught stealing often.",
                    direction: "asc",
                    id: "baseThirst",
                    name: "Base Thirst",
                    shorthand: "thrst",
                    weight: 0.1
                },
                {
                    description: "Governs runner advancement on hits, both how often and how many bases.",
                    direction: "asc",
                    id: "continuation",
                    name: "Continuation",
                    shorthand: "cont",
                    weight: 0.1
                },
                {
                    description: "Appears to determine if a batter's hit turns into a triple instead of a single.",
                    direction: "asc",
                    id: "groundFriction",
                    name: "Ground Friction",
                    shorthand: "fric",
                    weight: 0.1
                },
                {
                    description: "Related to runner advancement on an out, likely also related to sac flys.",
                    direction: "asc",
                    id: "indulgence",
                    name: "Indulgence",
                    shorthand: "indlg",
                    weight: 0.1
                },
                {
                    description: "The most significant factor in the baserunning star formula, appears to be a general measure of \"baserunning skill\".",
                    direction: "asc",
                    id: "laserlikeness",
                    name: "Laserlikeness",
                    shorthand: "laser",
                    weight: 0.5
                }
            ],
            group: "lineup",
            id: "baserunning",
            hasRating: true,
            name: "Baserunning"
        },
        {
            attributes: [
                {
                    description: "Seems to \"defend\" against base theft.",
                    direction: "asc",
                    id: "anticapitalism",
                    name: "Anticapitalism",
                    shorthand: "anticap",
                    weight: 0.1
                },
                {
                    description: "Defends against extra base hits, holding runners to first base.",
                    direction: "asc",
                    id: "chasiness",
                    name: "Chasiness",
                    shorthand: "chase",
                    weight: 0.1
                },
                {
                    description: "Controls fielding hits, turns batter hits into outs.",
                    direction: "asc",
                    id: "omniscience",
                    name: "Omniscience",
                    shorthand: "omni",
                    weight: 0.2
                },
                {
                    description: "Related to steal attempts in some form.",
                    direction: "asc",
                    id: "tenaciousness",
                    name: "Tenaciousness",
                    shorthand: "tenac",
                    weight: 0.2
                },
                {
                    description: "Reduces baserunning attempts - unknown impact on success rate.",
                    direction: "asc",
                    id: "watchfulness",
                    name: "Watchfulness",
                    shorthand: "watch",
                    weight: 0.1
                }
            ],
            description: "Defense stlats are particularly hard to determine because the simulation does not seem to track defenders' positions (Rule 5e. When a team is on Defense, <span class=\"redacted-group\"><span class=\"redacted\">all</span><span class=\"redacted\">of</span><span class=\"redacted\">the</span><span class=\"redacted\">team's</span><span class=\"super-redacted\">players</span><span class=\"redacted\">will</span><span class=\"redacted\">stand</span><span class=\"super-redacted\">somewhere</span><span class=\"redacted\">out</span><span class=\"redacted\">in</span><span class=\"redacted\">the</span><span class=\"redacted\">field.</span><span class=\"redacted\">Doesn't</span><span class=\"redacted\">really</span><span class=\"redacted\">matter</span><span class=\"redacted\">where.</span></span>) and the output does not always show which defenders were involved in a play.",
            group: "roster",
            id: "defense",
            hasRating: true,
            name: "Defense"
        },
        {
            attributes: [
                {
                    description: "Represents \"minimum vibes\" in the vibe calculation formula (higher pressurization = lower vibe floor).",
                    direction: "desc",
                    id: "pressurization",
                    name: "Pressurization",
                    shorthand: "prssr"
                },
                {
                    description: "Represents \"maximum vibes\" in the vibe calculation formula (higher cinnamon = higher vibe ceiling).",
                    direction: "asc",
                    id: "cinnamon",
                    name: "Cinnamon",
                    shorthand: "cinnm"
                }
            ],
            group: "roster",
            id: "vibes",
            hasRating: false,
            name: "Vibes"
        },
        {
            attributes: [
                {
                    description: "Represents the amount of 11-letter \"chunks\" in the player's soulscream. All players have a value between 2 and 9, with the historical exception of <a href=\"https://www.blaseball.com/player/a1628d97-16ca-4a75-b8df-569bae02bef9\">Chorby Soul</a>, with a value of 1777 and a selection of players who have gained soul either from the Ego or Hard Boiled modifications.",
                    direction: "asc",
                    id: "soul",
                    name: "Soul",
                    shorthand: "soul"
                },
                {
                    description: "Unknown effect. Ranges between 1 and 99. Directly visible on the player page, unlike other stlats. Seems to change sometimes when a player changes teams.",
                    direction: "asc",
                    id: "fate",
                    name: "Fate",
                    shorthand: "fate"
                },
                {
                    description: "<p>Finger count appears to represent instances of change to pitching stats. All players start with 10 fingers. Players impacted by general stat buffs all received 1 more finger, regardless of the size of the buff. Party buffs don't appear to grant fingers.</p><p>Raúl Leal received an over-debuff of 0.51 with the Iffey Jr. to Minimize them, and gained 51 fingers - they appear to have been given -0.01 to all stlats 51 times to get them to 0 in everything.</p><p>This process in reverse is likely how PolkaDot Patterson and Axel Trololol got their pitching maximized (we can check on Axel since we have their stat history) by adding a small amount repeatedly until they hit 5 stars.</p><p>Goodwin Morin seems to have gotten the reverse of Raúl's process when being maximized, instead of the same process PolkaDot Patterson and Axel Trololol got - resulting in gaining 81 fingers and +0.81 to every attribute. This brought their pitching to 5 stars, but boosted other ratings much further - they ended up with 7 baserunning stars, for example.</p>",
                    direction: "asc",
                    id: "totalFingers",
                    name: "Total Fingers",
                    shorthand: "fingers"
                },
                {
                    description: "Whether the player is allergic to peanuts. An allergic player will get an allergic reaction (a debuff) from swallowing a peanut during Peanut weather. Before the Expansion Era, a non-allergic player would get a \"yummy\" reaction (a buff) from swallowing a peanut during Peanut weather instead.",
                    direction: "asc",
                    id: "peanutAllergy",
                    name: "Peanut Allergy",
                    shorthand: "allergy"
                }
            ],
            group: "roster",
            id: "misc",
            hasRating: false,
            name: "Misc"
        }
    ]
}