import { ReactNode } from "react";
import { PageProps } from "../pages/_app";
import Emoji from "./emoji";

export default function Footer({ canSeeFk, isDarkMode, isItemApplied, toggleForbiddenKnowledge, toggleItemAdjustments, toggleLights }: PageProps) {

    return (
        <>
            <div className="flex items-center">
                <label><input type="checkbox" className="m-1" defaultChecked={isItemApplied} onClick={toggleItemAdjustments} /><span>Items Adjustments</span></label>
                <label><input type="checkbox" className="m-1" defaultChecked={canSeeFk} onClick={toggleForbiddenKnowledge} /><span>Forbidden Knowledge</span></label>
            </div>
            <div className="flex flex-row gap-1 justify-end">
                <div className="flex grow gap-1">
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
                <button className="bg-gray-300 dark:bg-gray-700 px-1.5 py-1 rounded-md cursor-pointer transition hover:bg-gray-400 dark:hover:bg-gray-600" onClick={toggleLights}><Emoji emoji={isDarkMode ? "0x1F506" : "0x1F311"} emojiClass="w-4 h-4 align-[-1px]" /></button>
            </div>
        </>
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