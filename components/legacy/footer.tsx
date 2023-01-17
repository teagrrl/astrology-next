import { ReactNode } from "react";
import { PageProps } from "@pages/_app";
import Emoji from "@components/emoji";

type FooterProps = PageProps & {
    isSimpleFooter?: boolean,
}

export default function Footer({ isSimpleFooter, isDarkMode, isItemApplied, isShowSimplified, toggleItemAdjustments, toggleHelp, toggleLights, toggleSimpleStats }: FooterProps) {
    return (
        <footer className="flex flex-row flex-wrap justify-end gap-1 p-2">
            {isSimpleFooter && <>
                <div className="flex items-center">
                    <label><input type="checkbox" className="m-1" defaultChecked={isItemApplied} onClick={toggleItemAdjustments} /><span>Items Adjustments</span></label>
                    <label><input type="checkbox" className="m-1" defaultChecked={isShowSimplified} onClick={toggleSimpleStats} /><span>Simplify Stats</span></label>
                </div>
            </>}
            <div className="flex flex-row gap-1 justify-end">
                <div className="hidden grow gap-1 md:flex">
                    <span className="px-1.5 py-1 font-bold">Colors</span>
                    <ColorReference color="bg-red-500/60">Terrible</ColorReference>
                    <ColorReference color="bg-orange-400/60">Bad</ColorReference>
                    <ColorReference color="bg-amber-300/60">Poor</ColorReference>
                    <ColorReference color="bg-lime-300/50">Okay</ColorReference>
                    <ColorReference color="bg-green-300/50">Good</ColorReference>
                    <ColorReference color="bg-teal-400/50">Great</ColorReference>
                    <ColorReference color="bg-blue-300/60">Exceptional</ColorReference>
                    <ColorReference color="bg-violet-300/50">Elite</ColorReference>
                    <ColorReference color="bg-fuchsia-400/50">Super Elite</ColorReference>
                </div>
                <button 
                    className="md:hidden bg-zinc-300 dark:bg-zinc-700 px-1.5 py-1 rounded-md cursor-pointer transition hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleHelp}
                >
                    <Emoji emoji="0x2753" emojiClass="w-4 h-4 align-[-1px]" />
                </button>
                <button 
                    className="bg-zinc-300 dark:bg-zinc-700 px-1.5 py-1 rounded-md cursor-pointer transition hover:bg-zinc-400 dark:hover:bg-zinc-600" onClick={toggleLights}
                >
                    <Emoji emoji={isDarkMode ? "0x1F506" : "0x1F311"} emojiClass="w-4 h-4 align-[-1px]" />
                </button>
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
        <span className={`px-1.5 py-1 rounded-md font-bold ${color}`}>{children}</span>
    )
}