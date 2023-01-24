import { ReactNode } from "react"
import getConfig from "next/config"
import Link from "next/link"
import ExportCSV, { ExportCSVProps } from "@components/legacy/exportcsv"

const { publicRuntimeConfig } = getConfig()

type PaginationProps = {
    children?: ReactNode,
    href: LinkHrefProps,
    currentPage: number,
    numPages: number, 
    exportData?: ExportCSVProps,
}

type LinkHrefProps = {
    pathname: string,
    query?: Record<string, string | string[] | undefined>,
}

type PaginationLinkProps = {
    children: ReactNode,
    href: LinkHrefProps,
    title?: string,
    isCurrent?: boolean,
    isNumberedPage?: boolean,
}

export default function Pagination({ children, href, currentPage, numPages, exportData }: PaginationProps) {
    const paginationPreview = publicRuntimeConfig.paginationPreview ?? 3;
    let previewStart = Math.max(currentPage - paginationPreview, 0);
    let previewEnd = numPages ? Math.min(currentPage + paginationPreview + 1, numPages) : currentPage + paginationPreview;
    if(previewStart === 0) {
        previewEnd = Math.min(numPages, paginationPreview * 2 + 1);
    }
    if(previewEnd === numPages) {
        previewStart = Math.max(0, numPages - paginationPreview * 2 - 1);
    }

    return (
        <div className="flex flex-row justify-end p-2">
            {children}
            {numPages > 1 && <ul className="flex grow justify-center">
                {numPages > paginationPreview * 2 + 1 && previewStart !== 0 && 
                    <PaginationLink 
                        href={appendQueriesToHref(href, { page: "0" })} 
                        title="Go to the first page"
                    >
                        <>
                            <span className="sm:hidden lg:inline">&laquo; </span>
                            <span className="hidden sm:inline">First</span>
                        </>
                    </PaginationLink>
                }
                {currentPage > 0 && 
                    <PaginationLink 
                        href={appendQueriesToHref(href, { page: (currentPage - 1).toString() })} 
                        title="Go to the previous page"
                    >
                        <>
                            <span className="sm:hidden lg:inline">&lsaquo; </span>
                            <span className="hidden sm:inline">Previous</span>
                        </>
                    </PaginationLink>
                }
                {numPages > paginationPreview * 2 + 1 && previewStart !== 0 && 
                    <li className="mx-px px-3 py-1 bg-zinc-200 dark:bg-zinc-600 cursor-default hidden md:list-item" title={`${previewStart} more pages`}>&hellip;</li>
                }
                {Array.from(Array(previewEnd - previewStart).keys()).map((index) => 
                    <PaginationLink 
                        key={`page_${previewStart + index + 1}`} 
                        href={appendQueriesToHref(href, { page: (previewStart + index).toString() })} 
                        title={`Go to page ${previewStart + index + 1}`} 
                        isCurrent={previewStart + index === currentPage}
                        isNumberedPage={true}
                    >
                        <>{previewStart + index + 1}</>
                    </PaginationLink>
                )}
                {numPages > paginationPreview * 2 + 1 && previewEnd !== numPages && 
                    <li className="mx-px px-3 py-1 bg-zinc-200 dark:bg-zinc-600 cursor-default hidden md:list-item" title={`${numPages - previewEnd} more pages`}>&hellip;</li>
                }
                {currentPage < numPages - 1 && 
                    <PaginationLink 
                        href={appendQueriesToHref(href, { page: (currentPage + 1).toString() })} 
                        title="Go to the next page"
                    >
                        <>
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden lg:inline"> &rsaquo;</span>
                        </>
                    </PaginationLink>
                }
                {numPages > paginationPreview * 2 + 1 && previewEnd !== numPages && 
                    <PaginationLink 
                        href={appendQueriesToHref(href, { page: (numPages - 1).toString() })} 
                        title="Go to the last page"
                    >
                        <>
                            <span className="hidden sm:inline">Last</span>
                            <span className="sm:hidden lg:inline"> &raquo;</span>
                        </>
                    </PaginationLink>
                }
            </ul>}
            {exportData && <ExportCSV {...exportData} />}
        </div>
    );
}

function PaginationLink({ children, href, title, isCurrent, isNumberedPage }: PaginationLinkProps) {
    return (
        <li className={`mx-px first:rounded-l-md last:rounded-r-md ${isCurrent ? "font-bold bg-zinc-400 dark:bg-zinc-500" : "bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"} ${isNumberedPage && !isCurrent ? "hidden sm:list-item" : ""}`}>
            {isCurrent 
                ? <div className="px-3 py-1 cursor-default" title="Current page">{children}</div>
                : <Link href={href}><a className="block px-3 py-1" title={title}>{children}</a></Link>
            }
        </li>
    )
}

function appendQueriesToHref(href: LinkHrefProps, query: Record<string, string | string[] | undefined>) {
    const mergedQueries: Record<string, string | string[]> = {}
    for(const key in href.query) {
        let value = href.query[key]
        if(value !== undefined) {
            mergedQueries[key] = value
        }
    }
    for(const key in query) {
        let value = query[key]
        if(value !== undefined) {
            mergedQueries[key] = value
        }
    }
    return {
        pathname: href.pathname,
        query: mergedQueries,
    }
}