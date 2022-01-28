import { ReactElement } from "react";
import AstrologyError from "../components/error";
import Layout from "../components/layout";
import AstrologyLoader from "../components/loader";
import Modification, { getModificationTitleById } from "../components/modification";
import Tooltip from "../components/tooltip";
import { getAffixDurability, getDetailedAffixData } from "../models/item";
import { reverseAttributes } from "../models/playerstats";
import { PageProps } from "./_app";

type AttributeProps = {
    id: string, 
    average: number,
    variance: number,
    min: number,
    max: number,
    values: number[],
}

export default function ItemPropertiesPage({ leagueData }: PageProps) {
	if(!leagueData) {
		return <AstrologyLoader />
	}
    if(leagueData.error) {
        return <AstrologyError code={400} message={`Astrology encountered an error: ${leagueData.error}`} />
    }
    
    const { elements, positions, mods } = getDetailedAffixData(leagueData.items ? Object.values(leagueData.items) : [])
    const filteredElements = elements.filter((element) => !["aDense", "eDense"].includes(element.name))

    function getElementPosition(name: string) {
        if(positions.prePrefix.includes(name)) {
            return "Pre-Prefix"
        }
        if(positions.prefix.includes(name)) {
            return "Prefix"
        }
        if(positions.postPrefix.includes(name)) {
            return "Post-Prefix"
        }
        if(positions.root.includes(name)) {
            return "Base"
        }
        if(positions.suffix.includes(name)) {
            return "Suffix"
        }
    }

    return (
        <section className="overflow-auto">
            <h1 className="font-bold text-3xl text-center my-5">Elemental Insight</h1>
            <ul className="flex flex-row flex-wrap justify-center gap-4 p-4">
                {filteredElements.map((element) =>
                    <li key={element.name} className="flex flex-col p-4 rounded-md bg-slate-400/20">
                        <div className="text-2xl font-bold">{element.name}</div>
                        <ul className="grow">
                            {mods[element.name] && <li>
                                <div><Modification id={mods[element.name]} type="player" /> Grants the <span className="font-semibold">{getModificationTitleById(mods[element.name])}</span> modification</div>
                            </li>}
                            {element.attributes.map((attribute) => 
                                <li key={attribute.id}>
                                    {getAttributeRange(attribute)}
                                </li>
                            )}
                            {getAffixDurability(element.name) !== 0 && <li>
                                Grants <span className={getAffixDurability(element.name) > 0 ? "text-sky-500 dark:text-sky-300" : "text-red-600 dark:text-red-400"}>{Math.abs(getAffixDurability(element.name) * 100)}%</span> {getAffixDurability(element.name) > 0 ? "increased" : "decreased"} <span className="font-semibold">Durability</span>
                            </li>}
                            {!mods[element.name] && element.attributes.length < 1 && getAffixDurability(element.name) === 0 && <li>
                                Does nothing.
                            </li>}
                        </ul>
                        <div className="text-sm text-right">({getElementPosition(element.name)})</div>
                    </li>
                )}
            </ul>
        </section>
    )
}

ItemPropertiesPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout 
            title="Elemental Insight - Astrology" 
            description="Your guide to the elements and their presumed attribute ranges."
            {...props}
        >
			{page}
		</Layout>
	)
}

function getAttributeRange({ id, values, average, variance, min, max }: AttributeProps) {
    const attributeName = id[0].toUpperCase() + id.slice(1)
    const verb = min < 0 ? "Decreases" : "Increases"
    const rangeMin = Math.floor(100 * (min > 0 ? min : Math.abs(max)))
    const rangeMax = Math.ceil(100 * (min > 0 ? max : Math.abs(min)))
    return (
        <div>
            {verb} <span className="font-semibold">{attributeName}</span> by <Tooltip content={<div><span className="font-semibold">Average Adjustment:</span> {average > 0 && "+"}{Math.round(1000 * average) / 1000}{variance !== 0 && ` \u00B1 ${Math.round(1000 * variance) / 1000}`}</div>}><span className={(reverseAttributes.includes(id) ? min < 0 : min > 0) ? "text-sky-500 dark:text-sky-300" : "text-red-600 dark:text-red-400"}>{Math.abs(Math.round(100 * average))}%</span></Tooltip> {rangeMin !== rangeMax && values.length > 1 && <Tooltip content={<div className="text-center"><div><span className="font-semibold">Observed Minimum:</span> {Math.round(1000 * min) / 1000}</div><div><span className="font-semibold">Observed Maximum:</span> {Math.round(1000 * max) / 1000}</div><div><span className="font-semibold">Samples:</span> {values.length}</div></div>}><span className="text-indigo-700 dark:text-slate-300">[{rangeMin} - {rangeMax}]%</span></Tooltip>}
        </div>
    )
}