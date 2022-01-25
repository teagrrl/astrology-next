import { ReactElement } from "react";
import AstrologyError from "../components/error";
import Layout from "../components/layout";
import AstrologyLoader from "../components/loader";
import Tooltip from "../components/tooltip";
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

    const items = leagueData.items ? Object.values(leagueData.items) : []
    const affixes: Record<string, Record<string, number[]>> = {}
    items.map((item) => {
        item.affixes.map((affix) => {
            affixes[affix.name] = affixes[affix.name] ?? []
            for(const attribute in affix.adjustments) {
                affixes[affix.name][attribute] = affixes[affix.name][attribute] ?? []
                affixes[affix.name][attribute].push(affix.adjustments[attribute])
            }
        })
    })
    const elements = []
    for(const name in affixes) {
        const attributes = []
        for(const attribute in affixes[name]) {
            const values = affixes[name][attribute]
            const average = values.reduce((v1, v2) => v1 + v2) / values.length
            attributes.push({
                id: attribute, 
                average: average,
                variance: Math.sqrt(values.reduce((stdev, value) => stdev + Math.pow(value - average, 2), 0) / values.length),
                min: Math.min(...values),
                max: Math.max(...values),
                values: values,
            })
        }
        if(attributes.length > 0) {
            attributes.sort((a1, a2) => {
                if(a1.average < a2.average) return 1
                if(a1.average > a2.average) return -1
                if(a1.id > a2.id) return 1
                if(a1.id < a2.id) return -1
                return 0
            })
            elements.push({
                name: name.startsWith("the ") ? name.substring(4) : name.endsWith("'s") ? name.substring(0, name.length - 2) : name,
                attributes: attributes,
            })
        }
    }
    elements.sort((e1, e2) => {
        let name1 = e1.name.toLowerCase()
        let name2 = e2.name.toLowerCase()
        if(name1 > name2) return 1
        if(name1 < name2) return -1
        return 0
    })

    return (
        <section className="overflow-auto">
            <h1 className="font-bold text-3xl text-center my-5">Elements</h1>
            <ul className="flex flex-row flex-wrap justify-center gap-4 mb-5">
                {elements.map((element) =>
                    <li key={element.name} className="p-4 rounded-md bg-slate-400/20">
                        <span className="text-2xl font-bold">{element.name}</span>
                        <ul>
                        {element.attributes.map((attribute) => 
                            <li key={attribute.id}>
                                {getAttributeRange(attribute)}
                            </li>
                        )}
                        </ul>
                    </li>
                )}
            </ul>
        </section>
    )
}

ItemPropertiesPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout {...props}>
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
            {verb} <span className="font-semibold">{attributeName}</span> by <Tooltip content={<div><span className="font-semibold">Average Adjustment:</span> {average > 0 && "+"}{Math.round(1000 * average) / 1000} &plusmn; {Math.round(1000 * variance) / 1000}</div>}><span className={(reverseAttributes.includes(id) ? min < 0 : min > 0) ? "text-sky-500 dark:text-sky-300" : "text-red-600 dark:text-red-400"}>{Math.abs(Math.round(100 * average))}%</span></Tooltip> {rangeMin !== rangeMax && <Tooltip content={<div className="text-center"><div><span className="font-semibold">Observed Minimum:</span> {Math.round(1000 * min) / 1000}</div><div><span className="font-semibold">Observed Maximum:</span> {Math.round(1000 * max) / 1000}</div><div><span className="font-semibold">Samples:</span> {values.length}</div></div>}><span className="text-indigo-700 dark:text-slate-300">[{rangeMin} - {rangeMax}]%</span></Tooltip>}
        </div>
    )
}