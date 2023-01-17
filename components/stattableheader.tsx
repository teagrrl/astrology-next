import { Fragment } from "react";
import { CategoryAttributes, playerColumns } from "@models/columns2";
import Emoji from "@components/emoji";
import TableHeader from "@components/tableheader";

export type StatTableHeaderProps = {
    columns?: CategoryAttributes[],
    sort?: string,
    direction?: "asc" | "desc",
    triggerSort?: Function,
    isShowSimplified?: boolean,
}

export default function StatTableHeader({ columns, sort, direction, triggerSort, isShowSimplified }: StatTableHeaderProps) {
    if(!columns) {
        columns = playerColumns
    }
    return (
        <>
            {columns.map((category) => 
                (category.isSimple || category.hasRating || !isShowSimplified) && <colgroup key={category.id} span={(category.hasRating ? 1 : 0) + (category.isSimple || !isShowSimplified ? category.columns.length : 0)} className="border-r-2 border-black dark:border-white last-of-type:border-0"></colgroup>
            )}
            <thead>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    {columns.map((category) => 
                        (category.isSimple || category.hasRating || !isShowSimplified) && <TableHeader key={`header_${category.id}`} colSpan={(category.hasRating ? 1 : 0) + (category.isSimple || !isShowSimplified ? category.columns.length : 0)}>{category.name}</TableHeader>
                    )}
                </tr>
                <tr className="border-b-[1px] border-black dark:border-zinc-500">
                    {columns.map((category) => 
                        <Fragment key={`header_${category.id}`}>
                            {category.hasRating && <TableHeader title={`${category.name} Stars`} sortId={category.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}><Emoji emoji="0x2B50" emojiClass="inline w-4 h-4" /></TableHeader>}
                            {(category.isSimple || !isShowSimplified) && category.columns.map((column) => 
                                <TableHeader key={`header_${column.id}`} title={column.name} sortId={column.id} sortBy={{ id: sort, direction: direction }} triggerSort={triggerSort}>{column.name}</TableHeader>
                            )}
                        </Fragment>
                    )}
                </tr>
            </thead>
        </>
    )
}