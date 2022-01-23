type AstrologyErrorProps = {
    code?: number,
    message?: string,
}

export default function AstrologyError({ code, message }: AstrologyErrorProps) {
    return (
		<section className="flex flex-col grow justify-center items-center">
            <h1 className="text-6xl font-bold p-5">{code}</h1>
            <h2 className="text-2xl font-semibold p-2">{message}</h2>
        </section>
    )
}