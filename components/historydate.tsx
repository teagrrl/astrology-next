type HistoryDateProps = {
    date: Date,
}

export default function HistoryDate({ date }: HistoryDateProps) {
    const foundTime = timeline.find((event) => date >= new Date(event.start) && date <= new Date(event.end))
    if(foundTime) {
        return <span>{foundTime.name}</span>
    }
    return (
        <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
    )
}

const timeline = [
    {
        name: "Season A",
        start: "March 1, 1983",
        end: "September 5, 1983",
    },
    {
        name: "History",
        start: "September 5, 1983",
        end: "March 1, 1984",
    },
    {
        name: "Season B",
        start: "March 1, 1984", // presumed
        end: "September 6, 1984",
    },
    {
        name: "History",
        start: "September 6, 1984",
        end: "March 1, 1985",
    },
    {
        name: "Season C",
        start: "March 1, 1985",
        end: "September 4, 1985",
    },
    {
        name: "History",
        start: "September 4, 1985",
        end: "March 1, 1986",
    },
    {
        name: "Season D",
        start: "March 1, 1986",
        end: "September 5, 1986", // presumed
    },
    {
        name: "History",
        start: "September 5, 1986",
        end: "March 1, 1987",
    },
    {
        name: "Season E",
        start: "March 1, 1987",
        end: "September 5, 1987", // presumed
    },
    {
        name: "History",
        start: "September 5, 1987",
        end: "January 2, 2000",
    },
    {
        name: "Season AA",
        start: "January 2, 2000",
        end: "July 6, 2000", // presumed
    },
    {
        name: "History",
        start: "July 6, 2000",
        end: "July 13, 2020",
    },
    {
        name: "Season 0",
        start: "July 13, 2020",
        end: "July 20, 2020", // presumed
    },
    {
        name: "Season 1",
        start: "July 20, 2020",
        end: "July 27, 2020",
    },
    {
        name: "Season 2",
        start: "July 27, 2020",
        end: "August 3, 2020",
    },
    {
        name: "Season 3",
        start: "August 3, 2020",
        end: "August 10, 2020",
    },
    {
        name: "Extended Siesta I",
        start: "August 10, 2020",
        end: "August 24, 2020",
    },
    {
        name: "Season 4",
        start: "August 24, 2020",
        end: "August 31, 2020",
    },
    {
        name: "Season 5",
        start: "August 31, 2020",
        end: "September 7, 2020",
    },
    {
        name: "Season 6",
        start: "September 7, 2020",
        end: "September 14, 2020",
    },
    {
        name: "Season 7",
        start: "September 14, 2020",
        end: "September 21, 2020",
    },
    {
        name: "Season 8",
        start: "September 21, 2020",
        end: "September 28, 2020",
    },
    {
        name: "Extended Siesta II",
        start: "September 28, 2020",
        end: "October 5, 2020",
    },
    {
        name: "Season 9",
        start: "October 5, 2020",
        end: "October 12, 2020",
    },
    {
        name: "Season 10",
        start: "October 12, 2020",
        end: "October 19, 2020",
    },
    {
        name: "Season 11",
        start: "October 19, 2020",
        end: "October 26, 2020",
    },
    {
        name: "Grand Siesta",
        start: "October 26, 2020",
        end: "November 17, 2020",
    },
    {
        name: "Coffee Cup",
        start: "November 17, 2020",
        end: "December 9, 2020",
    },
    {
        name: "Grand Siesta",
        start: "December 9, 2020",
        end: "March 1, 2021",
    },
    {
        name: "Season 12",
        start: "March 1, 2021",
        end: "March 8, 2021",
    },
    {
        name: "Season XIII",
        start: "March 8, 2021",
        end: "March 15, 2021",
    },
    {
        name: "Season 14",
        start: "March 15, 2021",
        end: "March 22, 2021",
    },
    {
        name: "Off Season I",
        start: "March 22, 2021",
        end: "April 5, 2021",
    },
    {
        name: "Season 15",
        start: "April 5, 2021",
        end: "April 12, 2021",
    },
    {
        name: "Season 16",
        start: "April 12, 2021",
        end: "April 19, 2021",
    },
    {
        name: "Season 17",
        start: "April 19, 2021",
        end: "April 25, 2021",
    },
    {
        name: "Off Season II",
        start: "April 25, 2021",
        end: "May 10, 2021",
    },
    {
        name: "Season 18",
        start: "May 10, 2021",
        end: "May 17, 2021",
    },
    {
        name: "Season 19",
        start: "May 17, 2021",
        end: "May 23, 2021",
    },
    {
        name: "Off Season III",
        start: "May 23, 2021",
        end: "June 14, 2021",
    },
    {
        name: "Season 20",
        start: "June 14, 2021",
        end: "June 21, 2021",
    },
    {
        name: "Season 21",
        start: "June 21, 2021",
        end: "June 28, 2021",
    },
    {
        name: "Season 22",
        start: "June 28, 2021",
        end: "July 5, 2021",
    },
    {
        name: "Off Season IIII",
        start: "July 5, 2021",
        end: "July 19, 2021",
    },
    {
        name: "Season 23",
        start: "July 19, 2021",
        end: "July 26, 2021",
    },
    {
        name: "Season 24",
        start: "July 26, 2021",
        end: "August 1, 2021",
    },
    {
        name: "Venti Siesta",
        start: "August 1, 2021",
        end: "October 27, 2021",
    },
    {
        name: "Gamma 4",
        start: "October 27, 2021", // presumed
        end: "November 1, 2021",
    },
    {
        name: "Gamma 8 Season 1",
        start: "November 1, 2021",
        end: "November 8, 2021",
    },
    {
        name: "Gamma 8 Season 2",
        start: "November 8, 2021",
        end: "November 15, 2021",
    },
    {
        name: "Venti Siesta",
        start: "November 15, 2021",
        end: "December 6, 2021",
    },
    {
        name: "Gamma 9",
        start: "December 6, 2021",
        end: "December 20, 2021",
    },
    {
        name: "Venti Siesta",
        start: "December 20, 2021",
        end: "January 24, 2022",
    },
    {
        name: "Gamma 10",
        start: "January 24, 2022",
        end: "February 7, 2022",
    },
    {
        name: "Venti Siesta",
        start: "February 7, 2022",
        end: "",
    },
]