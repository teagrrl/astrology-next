import { ReactElement } from "react";
import Emoji from "../components/emoji";
import Layout from "../components/layout";
import { getAllModifications } from "../components/modification";
import { PageProps } from "./_app";

export default function ModifiersPage({}: PageProps) {
    return (
        <section className="overflow-auto">
            <h1 className="font-bold text-3xl text-center my-5">Available Modifications</h1>
            <ul className="flex flex-row flex-wrap justify-center gap-4 mb-5">
                {getAllModifications().map((modification) => 
                    <li key={modification.id} className="p-4 rounded-md bg-slate-400/20">
                        <div className="grid grid-flow-col items-center">
                            {modification.emoji  
                                ? <div><Emoji emoji={modification.emoji} emojiClass="inline w-[1em] h-[1em] align-[-0.1em] mr-1.5" />({modification.emoji})</div>
                                : <div>(null)</div>
                            }
                            <div className="ml-1 font-bold">{modification.title}</div>
                        </div>
                        <div className="max-w-[20vw]">
                            {modification.description}
                        </div>
                    </li>
                )}
            </ul>
        </section>
    )
}

ModifiersPage.getLayout = function getLayout(page: ReactElement, props?: PageProps) {
	return (
		<Layout {...props}>
			{page}
		</Layout>
	)
}