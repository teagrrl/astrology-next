import { ReactElement, useState } from "react";
import AstrologyError from "../components/error";
import Layout from "../components/layout";
import AstrologyLoader from "../components/loader";
import PlayerItem from "../components/playeritem";
import Item, { adjustmentIndices } from "../models/item";
import { PageProps } from "./_app";

type Affix = {
    name: string,
    attributes: AffixAttribute[],
    position: AffixPosition,
}

type AffixPosition = "prefix" | "root" | "suffix"

type AffixAttribute = {
    id: string,
    value: number,
}

type ItemAffix = {
    name: string,
    adjustments: ItemAdjustment[],
}

type ItemAdjustment = ItemMod | ItemStat

type ItemMod = {
    type: 0,
    mod: string,
}

type ItemStat = {
    type: 1,
    stat: number,
    value: number,
}

export default function ItemForgePage({ leagueData }: PageProps) {
    const [forgePrefixes, setForgePrefixes] = useState<string[] | null>(null)
    const [forgeRoot, setForgeRoot] = useState<string | null>(null)
    const [forgeSuffix, setForgeSuffix] = useState<string | null>(null)

	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }

    const { elements, positions, mods } = getForgeData(leagueData.items ? Object.values(leagueData.items) : [])

    const getItemAffix = (name: string): ItemAffix => {
        const affix = elements.find((element) => element.name.toLowerCase() === name.toLowerCase())
        if(affix) {
            const adjustments: ItemAdjustment[] = affix.attributes.map((attribute) => {
                return {
                    type: 1,
                    stat: adjustmentIndices.indexOf(attribute.id),
                    value: attribute.value,
                }
            })
            if(Object.keys(mods).includes(affix.name)) {
                adjustments.push({
                    type: 0,
                    mod: mods[affix.name],
                })
            }
            return {
                name: affix.name,
                adjustments: adjustments
            }
        } else {
            return {
                name: name,
                adjustments: [],
            }
        }
    }

    const forgeItem = (root: string, prefixes: string[], suffix?: string): Item => {
        const itemRoot = getItemAffix(root)
        const itemSuffix = suffix ? getItemAffix(suffix) : null
        const itemPrefixes = prefixes.map((prefix) => getItemAffix(prefix))
        const prefixNames = itemPrefixes.map((prefix) => prefix.name)
        const prefixDurability = prefixNames.reduce((durability, name) => {
            switch(name) {
                case "Paper":
                    return durability - 2
                case "Glass":
                    return durability - 1
                case "Plastic":
                    return durability
                case "Rock":
                    return durability + 2
                case "Concrete":
                    return durability + 3
                case "Steel":
                    return durability + 3
                default:
                    return durability + 1
            }
        }, 0)
        const filteredPrefixNames = prefixNames.filter((name) => !["aDense", "eDense"].includes(name))
        const density = prefixNames.length - filteredPrefixNames.length
        const itemName = Array.from(new Set(filteredPrefixNames).values()).join(" ")
            + " " + itemRoot.name + (itemSuffix ? (" of " + itemSuffix.name) : "") + (density > 0 ? ("+" + density) : "")
        const durability = 1 + prefixDurability + (suffix ? 1 : 0)
        return new Item({
            id: itemName,
            name: itemName,
            prePrefix: null,
            prefixes: itemPrefixes,
            postPrefix: null,
            root: itemRoot,
            suffix: itemSuffix,
            health: durability,
            durability: durability,
            // we don't care about these
            hittingRating: 0,
            pitchingRating: 0,
            baserunningRating: 0,
            defenseRating: 0,
        })
    }

    const selectRoot = (root: string) => {
        setForgeRoot(root)
    }

    const appendPrefix = (prefix: string) => {
        setForgePrefixes((prefixes) => prefixes ? prefixes.concat(prefix) : [prefix])
    }

    const removeAllPrefixes = () => {
        setForgePrefixes([])
    }

    const selectSuffix = (suffix: string) => {
        setForgeSuffix(forgeSuffix === suffix ? null : suffix)
    }

    return (
        <section className="overflow-auto md:flex md:flex-wrap md:grow md:justify-center md:items-center">
            <h1 className="w-full font-bold text-3xl text-center my-5">The Astrological Forge</h1>
            <div className="m-4 md:p-4 md:border-[1px] md:border-zinc-500 md:dark:border-white md:rounded-md md:overflow-auto md:max-h-[70vh] md:max-w-[40vw]">
                {forgeRoot 
                    ? <PlayerItem item={forgeItem(forgeRoot, forgePrefixes ?? [], forgeSuffix ?? undefined)} showDetails={true} showModEmojis={true} showStats={true} />
                    : <h1 className="text-2xl font-bold">Select an item base to begin forging.</h1>
                }
            </div>
            <div className="m-4 md:p-4 md:border-[1px] md:border-zinc-500 md:dark:border-white md:rounded-md md:overflow-auto md:max-h-[70vh] md:max-w-[40vw]">
                <div className="flex flex-col grow overflow-auto">
                    <div>
                        <div className="text-lg font-bold">Choose a base: </div>
                        <ul className="flex flex-row flex-wrap p-2">
                            {Array.from(positions.root).map((root) => 
                                <li key={root} className="m-1">
                                    <button 
                                        className={`px-3 py-1 rounded-md ${forgeRoot === root ? "font-bold bg-zinc-300 dark:bg-zinc-400 cursor-not-allowed" : "font-semibold bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"}`}
                                        onClick={() => {selectRoot(root)}}
                                    >
                                        {root}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <div className="text-lg font-bold">Choose any number of prefixes: </div>
                        <ul className="flex flex-row flex-wrap p-2">
                            {forgePrefixes && forgePrefixes.length > 0 && <li className="m-1">
                                <button className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap bg-rose-600/70 dark:bg-rose-600/50 hover:bg-rose-600 dark:hover:bg-rose-600/70`} onClick={() => {removeAllPrefixes()}} >Reset</button>
                            </li>}
                            {Array.from(positions.prefix).map((prefix) => 
                                <li key={prefix} className="m-1">
                                    <button 
                                        className={`px-3 py-1 rounded-md font-semibold bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500`}
                                        onClick={() => {appendPrefix(prefix)}}
                                    >
                                        {prefix}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <div className="text-lg font-bold">Choose up to one suffix: </div>
                        <ul className="flex flex-row flex-wrap p-2">
                            {Array.from(positions.suffix).map((suffix) => 
                                <li key={suffix} className="m-1">
                                    <button 
                                        className={`px-3 py-1 rounded-md ${forgeSuffix === suffix ? "font-bold bg-zinc-300 dark:bg-zinc-400" : "font-semibold bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"}`}
                                        onClick={() => {selectSuffix(suffix)}}
                                    >
                                        {suffix}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

ItemForgePage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="The Forge - Astrology" 
            description="Construct your own items in the Astrological Forge."
            {...props}
        >
			{page}
		</Layout>
	)
}

function getForgeData(items: Item[]) {
    const affixes: Record<string, Record<string, number[]>> = {}
    const positions = {
        prefix: new Set<string>(),
        root: new Set<string>(),
        suffix: new Set<string>(),
    }
    const mods: Record<string, string> = {}
    items.map((item) => {
        item.affixes.map((affix) => {
            if(affix.position) {
                positions[affix.position].add(affix.name)
            }
            affixes[affix.name] = affixes[affix.name] ?? []
            for(const attribute in affix.adjustments) {
                affixes[affix.name][attribute] = affixes[affix.name][attribute] ?? []
                affixes[affix.name][attribute].push(affix.adjustments[attribute])
            }
        })
        for(const name in item.mods) {
            if(!mods[name]) {
                mods[name] = item.mods[name]
            }
        }
    })
    const elements: Affix[] = []
    for(const name in affixes) {
        const attributes = []
        for(const attribute in affixes[name]) {
            const values = affixes[name][attribute]
            attributes.push({
                id: attribute, 
                value: values.reduce((v1, v2) => v1 + v2) / values.length,
            })
        }
        attributes.sort((a1, a2) => {
            if(a1.value < a2.value) return 1
            if(a1.value > a2.value) return -1
            if(a1.id > a2.id) return 1
            if(a1.id < a2.id) return -1
            return 0
        })
        elements.push({
            name: name,
            attributes: attributes,
            position: "prefix",
        })
    }
    return {
        elements: elements.sort((element1, element2) => {
            if(element1.name > element2.name) return 1
            if(element2.name > element1.name) return -1
            return 0     
        }),
        positions: {
            prefix: Array.from(positions.prefix.values()).sort(),
            root: Array.from(positions.root.values()).sort(),
            suffix: Array.from(positions.suffix.values()).sort(),
        },
        mods: mods,
    }
}