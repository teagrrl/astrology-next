import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import Layout from '@components/layout'
import { defaultScaleColors, hexToRGBA, PageProps, scaleColorNames } from '@pages/_app'

export default function SettingsPage({ scaleColors, changeColors }: PageProps) {
    const savedColors = scaleColorNames.map((name, index) => {
        return {
            name: name, 
            color: scaleColors && scaleColors[index] ? scaleColors[index] : defaultScaleColors[index],
        }
    })
    const [customColors, setCustomColors] = useState(savedColors)

    useEffect(() => {
        if(changeColors) {
            changeColors(customColors.map((data) => data.color))
        }
    }, [changeColors, customColors])

    function onChangeColor(e: ChangeEvent<HTMLInputElement>, index: number) {
        const updatedColors = Array.from(customColors)
        updatedColors[index].color = e.target.value
        setCustomColors(updatedColors)
    }

    function resetColors() {
        setCustomColors(scaleColorNames.map((name, index) => {
            return {
                name: name,
                color: defaultScaleColors[index],
            }
        }))
    }
    
	return (
        <section className="overflow-auto">
            <div className="flex flex-col p-5 gap-5 items-center">
                <h1 className="text-3xl font-bold text-center">Settings</h1>
                <div className="flex flex-row gap-4 justify-center">
                    <div className="flex flex-col p-4 gap-4 bg-neutral-200 dark:bg-neutral-800 rounded-md">
                        <h2 className="flex-grow text-2xl font-bold text-center">Colors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {customColors.map((data, index) => 
                                <div key={`color_${index}`} className="flex flex-row items-center">
                                    <span className="flex-grow text-xl font-semibold text-center px-3 py-1 rounded-l-md" style={{ backgroundColor: hexToRGBA(data.color, 0.5) }}>{data.name}</span>
                                    <input className="w-12 h-12 rounded-md text-black" type="color" value={data.color} onChange={(e) => onChangeColor(e, index)} />
                                </div>
                            )}
                        </div>
                        <button className="px-3 py-1 font-semibold rounded-md bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={resetColors}>Reset Colors</button>
                    </div>
                </div>
                <p className="max-w-xl text-justify mb-8">This is an experimental feature to change the color scaling in case you have some form of color blindness or just straight up do not enjoy the colors I have chosen for this tool. You can also toggle on and off the color scaling in the bottom widget. In the future maybe some more settings will appear here.</p>
            </div>
        </section>
	)
}

SettingsPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout hasFooter={true} {...props}>
			{page}
		</Layout>
	)
}