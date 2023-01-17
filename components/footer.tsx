import { ReactNode, useState } from "react";
import { PageProps } from "@pages/_app";
import Emoji from "@components/emoji";
import Tooltip from "@components/tooltip";

type FooterProps = PageProps & {
    isSimpleFooter?: boolean,
}

export default function Footer({ isSimpleFooter, isDarkMode, isItemApplied, isShowSimplified, toggleLights, toggleItemAdjustments, toggleSimpleStats }: FooterProps) {
    const [colorRefVisible, setColorRefVisible] = useState<boolean>(false)

    function toggleColorRef() {
        setColorRefVisible(!colorRefVisible)
    }

    return (
        <footer className="fixed bottom-0 right-2 flex flex-col">
            {colorRefVisible && <div className="self-end mr-2 grid grid-cols-3 gap-1 px-2 pt-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-t-md">
                {/*<span className="px-1.5 py-1 text-center font-bold">Colors</span>*/}
                <ColorReference color="bg-red-500/60">Terrible</ColorReference>
                <ColorReference color="bg-orange-400/60">Bad</ColorReference>
                <ColorReference color="bg-amber-300/60">Poor</ColorReference>
                <ColorReference color="bg-lime-300/50">Okay</ColorReference>
                <ColorReference color="bg-green-300/50">Good</ColorReference>
                <ColorReference color="bg-teal-400/50">Great</ColorReference>
                <ColorReference color="bg-blue-300/60">Exceptional</ColorReference>
                <ColorReference color="bg-violet-300/50">Elite</ColorReference>
                <ColorReference color="bg-fuchsia-400/50">Super Elite</ColorReference>
            </div>}
            <div className="flex flex-row justify-end gap-1 p-2 rounded-t-md bg-zinc-100 dark:bg-zinc-800">
                <div className="flex flex-row gap-1 justify-end">
                    <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleColorRef}>What do the colors mean?</button>
                    {isSimpleFooter && <>
                        {/*<Tooltip content={isItemApplied ? "Hide item adjustments" : "Show item adjustments"}>
                            <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleItemAdjustments}>
                                <Emoji emoji={isItemApplied ? "0x1F590" : "0x1F6F9"} emojiClass="w-4 h-4 align-[-1px]" />
                            </button>
                        </Tooltip>*/}
                        <Tooltip content={isShowSimplified ? "Show more numbers" : "Show fewer numbers"}>
                            <button className="px-1.5 py-1 rounded-md cursor-pointer transition font-bold bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleSimpleStats}>
                                <Emoji emoji={isShowSimplified ? "0x1F31F" : "0x2B50"} emojiClass="w-4 h-4 align-[-1px]" />
                            </button>
                        </Tooltip>
                    </>}
                    <Tooltip content={isDarkMode ? "Turn on the lights" : "Turn off the lights"}>
                        <button className="px-1.5 py-1 rounded-md cursor-pointer transition bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleLights}>
                            <Emoji emoji={isDarkMode ? "0x1F506" : "0x1F311"} emojiClass="w-4 h-4 align-[-1px]" />
                        </button>
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
        <span className={`text-center px-1.5 py-1 rounded-md ${color}`}>{children}</span>
    )
}