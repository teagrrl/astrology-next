type AstrologyLoaderProps = {
    message?: string,
}

export default function AstrologyLoader({ message }: AstrologyLoaderProps) {
    return (
        <section className="flex grow justify-center items-center">
            <h1 className="p-5 text-6xl font-bold">{message ?? "Loading..."}</h1>
        </section>
    )
}