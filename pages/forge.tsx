import { ReactElement, useState } from "react";
import AstrologyError from "../components/error";
import Layout from "../components/layout";
import AstrologyLoader from "../components/loader";
import PlayerItem from "../components/playeritem";
import { ItemAdjustment } from "../models/chronicler";
import Item, { adjustmentIndices, getAffixDurability, getDetailedAffixData } from "../models/item";
import { PageProps } from "./_app";

enum AffixSelectorLimit {
    ExactlyOne,
    UpToOne, 
    AnyNumber,
}

type AffixSelectorProps = {
    name: string,
    affixes: string[],
    activeAffix?: string | null,
    selectAffix: Function,
    resetActive?: boolean,
    resetAffixes?: Function,
    limit: AffixSelectorLimit,
}

type ItemAffix = {
    name: string,
    adjustments: ItemAdjustment[],
}

export default function ItemForgePage({ leagueData }: PageProps) {
    const [forgePrePrefix, setForgePrePrefix] = useState<string | null>(null)
    const [forgePrefixes, setForgePrefixes] = useState<string[] | null>(null)
    const [forgePostPrefix, setForgePostPrefix] = useState<string | null>(null)
    const [forgeRoot, setForgeRoot] = useState<string | null>(null)
    const [forgeSuffix, setForgeSuffix] = useState<string | null>(null)

	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }

    const { elements, positions, mods } = getDetailedAffixData(leagueData.items ? Object.values(leagueData.items) : [])

    const getItemAffix = (name: string): ItemAffix => {
        const affix = elements.find((element) => element.name.toLowerCase() === name.toLowerCase())
        if(affix) {
            const adjustments: ItemAdjustment[] = affix.attributes.map((attribute) => {
                return {
                    type: 1,
                    stat: adjustmentIndices.indexOf(attribute.id),
                    value: attribute.average,
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

    const forgeItem = (root: string, prefixes: string[], prePrefix?: string, postPrefix?: string, suffix?: string): Item => {
        const itemRoot = getItemAffix(root)
        const itemPrePrefix = prePrefix ? getItemAffix(prePrefix) : null
        const itemPrefixes = prefixes.map((prefix) => getItemAffix(prefix))
        const itemPostPrefix = postPrefix ? getItemAffix(postPrefix) : null
        const itemSuffix = suffix ? getItemAffix(suffix) : null
        const prefixNames = itemPrefixes.map((prefix) => prefix.name)
        const filteredPrefixNames = prefixNames.filter((name) => !["aDense", "eDense"].includes(name))
        const density = prefixNames.length - filteredPrefixNames.length

        const itemName = (itemPrePrefix ? (itemPrePrefix.name + " ") : "")
            + Array.from(new Set(filteredPrefixNames).values()).join(" ") + " "
            + (itemPostPrefix ? (itemPostPrefix.name + " ") : "")
            + itemRoot.name 
            + (itemSuffix ? (" of " + itemSuffix.name) : "") + (density > 0 ? ("+" + density) : "")

        const itemDurability = Math.max([itemRoot, itemPrePrefix, ...itemPrefixes, itemPostPrefix, itemSuffix]
            .filter((affix): affix is ItemAffix => affix !== null)
            .reduce((durability, affix) => durability + getAffixDurability(affix.name) + 1, 0), 1)

        return new Item({
            id: itemName,
            name: itemName,
            prePrefix: itemPrePrefix,
            prefixes: itemPrefixes,
            postPrefix: itemPostPrefix,
            root: itemRoot,
            suffix: itemSuffix,
            health: itemDurability,
            durability: itemDurability,
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

    const selectPrePrefix = (prefix: string) => {
        setForgePrePrefix(forgePrePrefix === prefix ? null : prefix)
    }

    const selectPostPrefix = (prefix: string) => {
        setForgePostPrefix(forgePostPrefix === prefix ? null : prefix)
    }

    const selectSuffix = (suffix: string) => {
        setForgeSuffix(forgeSuffix === suffix ? null : suffix)
    }

    return (
        <section className="overflow-auto md:flex md:flex-wrap md:grow md:justify-center md:items-center">
            <h1 className="w-full font-bold text-3xl text-center my-5">The Astrological Forge</h1>
            <div className="m-4 p-4 border-[1px] border-zinc-500 dark:border-white md:rounded-md md:overflow-auto md:max-h-[70vh] md:max-w-[40vw]">
                {forgeRoot 
                    ? <PlayerItem item={forgeItem(forgeRoot, forgePrefixes ?? [], forgePrePrefix ?? undefined, forgePostPrefix ?? undefined, forgeSuffix ?? undefined)} showDetails={true} showModEmojis={true} showStats={true} />
                    : <h1 className="text-2xl font-bold">Select an item base to begin forging.</h1>
                }
            </div>
            <div className="md:py-2 md:border-[1px] md:border-zinc-500 md:dark:border-white md:rounded-md md:overflow-auto md:max-h-[70vh] md:max-w-[40vw]">
                <div className="flex flex-col grow overflow-auto">
                    <AffixSelector name="base" limit={AffixSelectorLimit.ExactlyOne} affixes={positions.root} activeAffix={forgeRoot} selectAffix={selectRoot} />
                    <AffixSelector name="prefix" limit={AffixSelectorLimit.AnyNumber} affixes={positions.prefix} selectAffix={appendPrefix} resetActive={(forgePrefixes ?? []).length > 0} resetAffixes={removeAllPrefixes} />
                    <AffixSelector name="pre-prefix" limit={AffixSelectorLimit.UpToOne} affixes={positions.prePrefix} activeAffix={forgePrePrefix} selectAffix={selectPrePrefix} />
                    <AffixSelector name="post-prefix" limit={AffixSelectorLimit.UpToOne} affixes={positions.postPrefix} activeAffix={forgePostPrefix} selectAffix={selectPostPrefix} />
                    <AffixSelector name="suffix" limit={AffixSelectorLimit.UpToOne} affixes={positions.suffix} activeAffix={forgeSuffix} selectAffix={selectSuffix} />
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
function AffixSelector({ name, limit, affixes, activeAffix, selectAffix, resetActive, resetAffixes }: AffixSelectorProps) {
    let header;
    let activeClass = "";
    switch(limit) {
        case AffixSelectorLimit.ExactlyOne:
            header = `Choose exactly one ${name}`
            activeClass = "bg-zinc-400 cursor-not-allowed"
            break;
        case AffixSelectorLimit.UpToOne:
            header = `Choose up to one ${name}`
            activeClass = "bg-zinc-400"
            break;
        case AffixSelectorLimit.AnyNumber:
            header = `Choose any number of ${name}`
            activeClass = "bg-zinc-400"
            break;
    }
    return (
        <div className="px-4 py-2 even:bg-zinc-100 even:dark:bg-zinc-800">
            <div className="text-lg font-bold">{header}:</div>
            <ul className="flex flex-row flex-wrap p-2">
                {resetAffixes && resetActive && <li className="m-1">
                    <button className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap bg-rose-600/70 dark:bg-rose-600/50 hover:bg-rose-600 dark:hover:bg-rose-600/70`} onClick={() => {resetAffixes()}}>Reset</button>
                </li>}
                {affixes.map((affix) => 
                    <li key={affix} className="m-1">
                        <button 
                            className={`px-3 py-1 rounded-md ${activeAffix === affix ? `font-bold ${activeClass}` : "font-semibold bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"}`}
                            onClick={() => {selectAffix(affix)}}
                        >
                            {affix}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}