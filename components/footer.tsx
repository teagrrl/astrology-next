import { ReactNode, useState } from "react";
import { PageProps } from "@pages/_app";
import Emoji from "@components/emoji";
import Tooltip from "@components/tooltip";
import Link from "next/link";
import { defaultScaleColors, hexToRGBA, scaleColorNames } from "@models/helpers";

type FooterProps = PageProps & {
    isSimpleFooter?: boolean,
}

export default function Footer({ isSimpleFooter, isDarkMode, isShowColors, isItemApplied, isShowSimplified, scaleColors, toggleLights, toggleColors, toggleItemAdjustments, toggleSimpleStats }: FooterProps) {
    const [colorRefVisible, setColorRefVisible] = useState<boolean>(false)

    function toggleColorRef() {
        setColorRefVisible(!colorRefVisible)
    }

    const customScaleColors = scaleColorNames.map((name, index) => {
        return {
            name: name, 
            color: scaleColors && scaleColors[index] ? scaleColors[index] : defaultScaleColors[index],
        }
    })

    function onToggleLights() {
        if(toggleLights) {
            toggleLights()
        }
    }

    function onToggleColors() {
        if(toggleColors) {
            toggleColors()
        }
    }

    function onToggleSimpleStats() {
        if(toggleSimpleStats) {
            toggleSimpleStats()
        }
    }

    function onToggleItemAdjustments() {
        if(toggleItemAdjustments) {
            toggleItemAdjustments()
        }
    }

    return (
        <footer className="fixed bottom-0 right-2 flex flex-col">
            {colorRefVisible && <div className="self-end mr-2 grid grid-cols-3 gap-1 px-2 pt-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-t-md">
                {/*<span className="px-1.5 py-1 text-center font-bold">Colors</span>*/}
                {customScaleColors.map((data, index) => 
                    <ColorReference key={`ref_${index}`} color={data.color}>{data.name}</ColorReference>
                )}
            </div>}
            <div className="flex flex-row justify-end gap-1 p-2 rounded-t-md bg-zinc-100 dark:bg-zinc-800">
                <div className="flex flex-row gap-1 justify-end h-8">
                    {isShowColors && <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleColorRef}>What do the colors mean?</button>}
                    <Tooltip content={isShowColors ? "Hide color scaling" : "Show color scaling"}>
                        <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={onToggleColors}>
                            <Emoji emoji={isShowColors ? "0x2601" : "0x1F308"} emojiClass="w-4 h-4 align-[-1px]" />
                        </button>
                    </Tooltip>
                    {isSimpleFooter && <>
                        {/*<Tooltip content={isItemApplied ? "Hide item adjustments" : "Show item adjustments"}>
                            <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={onToggleItemAdjustments}>
                                <Emoji emoji={isItemApplied ? "0x1F590" : "0x1F6F9"} emojiClass="w-4 h-4 align-[-1px]" />
                            </button>
                        </Tooltip>*/}
                        <Tooltip content={isShowSimplified ? "Show more numbers" : "Show fewer numbers"}>
                            <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={onToggleSimpleStats}>
                                <Emoji emoji={isShowSimplified ? "0x1F31F" : "0x2B50"} emojiClass="w-4 h-4 align-[-1px]" />
                            </button>
                        </Tooltip>
                    </>}
                    <Tooltip content={isDarkMode ? "Turn on the lights" : "Turn off the lights"}>
                        <button className="px-1.5 py-1 rounded-md cursor-pointer transition bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={onToggleLights}>
                            <Emoji emoji={isDarkMode ? "0x1F506" : "0x1F311"} emojiClass="w-4 h-4 align-[-1px]" />
                        </button>
                    </Tooltip>
                    <Tooltip content={"Settings (Experimental)"}>
                        <div className="flex">
                            <Link href="/settings">
                                <a className="flex items-center px-1.5 py-1 rounded-md transition bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600">
                                    <Emoji emoji={"0x2699"} emojiClass="w-4 h-4 align-[-1px]" />
                                </a>
                            </Link>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </footer>
    );
}

type ColorReferenceProps = {
    children?: ReactNode, 
    color: string,
}

function ColorReference({ children, color }: ColorReferenceProps) {
    return (
        <span className="text-center px-1.5 py-1 rounded-md" style={{ backgroundColor: hexToRGBA(color, 0.5) }}>{children}</span>
    )
}