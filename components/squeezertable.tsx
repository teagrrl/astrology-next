import Link from "next/link";
import { Fragment } from "react";
import { columns } from "../models/columns";
import Team from "../models/team";
import { Averages } from "../pages/api/chronicler";
import AverageStat from "./averagestat";
import Emoji from "./emoji";
import ModificationList from "./modificationlist";
import TableHeader from "./tableheader";

type SqueezerTableProps = {
    teams?: Team[],
    averages?: Record<string, Averages>,
    ranks?: Record<string, number>,
    sort?: string,
    direction?: "asc" | "desc",
    triggerSort?: Function,
    isItemApplied?: boolean,
    isShowSimplified?: boolean,
}

export default function SqueezerTable({teams, averages, ranks, sort, direction, triggerSort, isItemApplied, isShowSimplified}: SqueezerTableProps) {
    if(!teams || !averages) {
        return <h1 className="flex justify-center text-xl">Loading...</h1>
    }
    if(!teams.length) {
        return <h1 className="flex justify-center text-xl">We&apos;re sorry but we could not find any teams to squeeze in this universe.</h1>
        }
    return (
        <div className="overflow-auto">
            <table className="table-auto">
            <colgroup span={(isShowSimplified ? 0 : columns.sibrmetrics.length) + 5} className="border-r-2 border-black dark:border-white"></colgroup>
                    {columns.categories.map((category) => 
                        isShowSimplified 
                            ? category.hasRating && <colgroup key={`colgroup_${category.id}`}></colgroup>
                            : <colgroup key={`colgroup_${category.id}`} span={category.attributes.length + (category.hasRating ? 1 : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
                    )}
                    <thead>
                        <tr className="border-b-[1px] border-black dark:border-zinc-500">
                            <TableHeader colSpan={(isShowSimplified ? 0 : columns.sibrmetrics.length) + 5}>General</TableHeader>
                            {columns.categories.map((category) =>
                                isShowSimplified 
                                    ? category.hasRating && <TableHeader key={`header_${category.id}`}>{category.name}</TableHeader>
                                    : <TableHeader key={`header_${category.id}`} colSpan={category.attributes.length + (category.hasRating ? 1 : 0)}>{category.name}</TableHeader>
                            )}
                        </tr>
                        <tr className="border-b-[1px] border-black dark:border-zinc-500">
                            <TableHeader colSpan={2} sortId="name" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Team Name">Name</TableHeader>
                            <TableHeader sortId="rank" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Team Rank">Rank</TableHeader>
                            <TableHeader sortId="modifications" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Player Modifications">Modifications</TableHeader>
                            {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) => 
                                <TableHeader key={sibrmetric.id} sortId={sibrmetric.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title={sibrmetric.name}>{sibrmetric.shorthand}</TableHeader>
                            )}
                            <TableHeader sortId="combined" sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title="Combined Stars"><Emoji emoji="0x1F31F" emojiClass="inline w-4 h-4" /></TableHeader>
                            {columns.categories.map((category) =>
                                <Fragment key={`subheader_${category.id}`}>
                                    {category.hasRating && <TableHeader sortId={category.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title={`${category.name} Stars`}><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></TableHeader>}
                                    {!isShowSimplified && category.attributes.map((attribute) =>
                                        <TableHeader key={`subheader_${attribute.id}`} sortId={attribute.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort} title={attribute.name}>{attribute.shorthand}</TableHeader>
                                    )}
                                </Fragment>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) =>
                            <tr key={team.id} className="duration-300 hover:bg-zinc-400/20">
                                <td className="px-1.5 py-1 whitespace-nowrap">
                                    {false && <Emoji emoji="0x1F480" emojiClass="inline min-w-[1em] h-4 mr-1" />}
                                    <Link href={{
                                        pathname: "/team/[slugOrId]",
                                        query: {
                                            slugOrId: team.slug()
                                        }
                                    }}>
                                        <a className="font-bold">{team.canonicalName()}</a>
                                    </Link>
                                </td>
                                <td className="px-1.5 py-1">
                                    <a href={`https://blaseball.com/team/${team.id}`} title={`Go to official team page for the ${team.canonicalName()}`}>
                                        <Emoji emoji="0x1F517" emojiClass="min-w-[1em] h-4" />
                                    </a>
                                </td>
                                <td className="px-1.5 py-1 text-center">
                                    {ranks ? ranks[team.id] + 1 : "N/A"}
                                </td>
                                <td className="px-1.5 py-1 text-center">
                                    {team.modifications().length > 0 
                                        ? <ModificationList 
                                            type="team" 
                                            permanent={team.data.permAttr} 
                                            season={team.data.seasAttr} 
                                            week={team.data.weekAttr} 
                                            game={team.data.gameAttr} 
                                        />
                                        : <>-</>
                                    }
                                </td>
                                {!isShowSimplified && columns.sibrmetrics.map((sibrmetric) =>
                                     <AverageStat key={`${team.id}_${sibrmetric.id}`} header={team.canonicalName()} averages={averages[team.id].roster} stat={sibrmetric} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                                )}
                                <AverageStat header={team.canonicalName()} averages={averages[team.id].roster} id="combined" hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />
                                {columns.categories.map((category) =>
                                    <Fragment key={`${team.id}_${category.id}`}>
                                        {category.hasRating && <AverageStat key={`${team.id}_${category.id}`} header={team.canonicalName()} averages={averages[team.id].roster} stat={category} hasColorScale={true} isStarRating={true} isItemApplied={isItemApplied} />}
                                        {!isShowSimplified && category.attributes.map((attribute) => 
                                            <AverageStat key={`${team.id}_${attribute.id}`} header={team.canonicalName()} averages={averages[team.id].roster} stat={attribute} hasColorScale={attribute.id === "peanutAllergy" || category.id !== "misc"} isItemApplied={isItemApplied} />
                                        )}
                                    </Fragment>
                                )}
                            </tr>
                        )}
                    </tbody>
            </table>
        </div>
    )
}