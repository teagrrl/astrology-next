import getConfig from "next/config";
import Link from "next/link";
import { ReactNode } from "react";

const { publicRuntimeConfig } = getConfig()

type LinkHrefProps = {
    pathname: string,
    query?: Record<string, string | undefined>,
}

type PaginationProps = {
    href: LinkHrefProps,
    currentPage: number,
    numPages: number, 
}

type PaginationLinkProps = {
    children: ReactNode,
    href: LinkHrefProps,
    title?: string,
    isCurrent?: boolean,
}

export default function Pagination({ href, currentPage, numPages }: PaginationProps) {
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
        <ul className="flex flex-row flex-nowrap justify-center my-2">
            {numPages > paginationPreview * 2 + 1 && previewStart !== 0 && 
                <PaginationLink 
                    href={appendQueriesToHref(href, { page: "0" })} 
                    title="Go to the first page"
                >
                    First
                </PaginationLink>
            }
            {currentPage > 0 && 
                <PaginationLink 
                    href={appendQueriesToHref(href, { page: (currentPage - 1).toString() })} 
                    title="Go to the previous page"
                >
                    Previous
                </PaginationLink>
            }
            {numPages > paginationPreview * 2 + 1 && previewStart !== 0 && 
                <li className="mx-px px-3 py-1 bg-zinc-200 dark:bg-zinc-600 cursor-default" title={`${previewStart} more pages`}>&hellip;</li>
            }
            {Array.from(Array(previewEnd - previewStart).keys()).map((index) => 
                <PaginationLink 
                    key={`page_${previewStart + index + 1}`} 
                    href={appendQueriesToHref(href, { page: (previewStart + index).toString() })} 
                    title={`Go to page ${previewStart + index + 1}`} 
                    isCurrent={previewStart + index === currentPage}
                >
                    <>{previewStart + index + 1}</>
                </PaginationLink>
            )}
            {numPages > paginationPreview * 2 + 1 && previewEnd !== numPages && 
                <li className="mx-px px-3 py-1 bg-zinc-200 dark:bg-zinc-600 cursor-default" title={`${numPages - previewEnd} more pages`}>&hellip;</li>
            }
            {currentPage < numPages - 1 && 
                <PaginationLink 
                    href={appendQueriesToHref(href, { page: (currentPage + 1).toString() })} 
                    title="Go to the next page"
                >
                    Next
                </PaginationLink>
            }
            {numPages > paginationPreview * 2 + 1 && previewEnd !== numPages && 
                <PaginationLink 
                    href={appendQueriesToHref(href, { page: (numPages - 1).toString() })} 
                    title="Go to the last page"
                >
                    Last
                </PaginationLink>
            }
            {/*props.handlePlayerSearch && <li className="player-search"><input type="search" placeholder="Search for a player..." onChange={props.handlePlayerSearch} /></li>*/}
        </ul>
    );
}

function PaginationLink({ children, href, title, isCurrent }: PaginationLinkProps) {
    return (
        <li className={`mx-px first:rounded-l-md last:rounded-r-md ${isCurrent ? "font-bold bg-zinc-400 dark:bg-zinc-500" : "bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"}`}>
            {isCurrent 
                ? <div className="px-3 py-1 cursor-default" title="Current page">{children}</div>
                : <Link href={href}><a className="block px-3 py-1" title={title}>{children}</a></Link>
            }
        </li>
    )
}

function appendQueriesToHref(href: LinkHrefProps, query: Record<string, string | undefined>) {
    const mergedQueries: Record<string, string> = {}
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