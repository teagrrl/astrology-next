type HistoryDateProps = {
    date: Date,
}

export default function HistoryDate({ date }: HistoryDateProps) {
    return (
        <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
    )
}