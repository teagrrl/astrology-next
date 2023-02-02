import { BlaseballElection, BlaseballElectionGroup, BlaseballElectionOption, BlaseballElectionResult, BlaseballTeam } from "@models/api2"


export default class Election {
    public readonly id: string
    public readonly number: number
    public readonly decrees: Decree[]
    public readonly blessings: Blessing[]

    constructor(id: string, number: number, data: BlaseballElection) {
        this.id = id
        this.number = number
        this.decrees = data.decrees.map((decree) => new Decree(decree))
        this.blessings = data.blessings.map((blessing) => new Blessing(blessing))
    }
}

class Decree {
    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly complete: boolean
    public readonly maximum: number
    public readonly options: DecreeOption[]

    constructor(data: BlaseballElectionGroup) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.complete = data.electionComplete
        this.maximum = data.maximumAllowed
        this.options = data.electionOptions
            .map((option) => new DecreeOption(option))
            .filter((option) => !this.complete || option.results.filter((result) => result.votes > 0).length > 0)
    }
}

class DecreeOption {
    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly subheading: string
    public readonly icon: string
    public readonly results: DecreeResult[]

    constructor(data: BlaseballElectionOption) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.subheading = data.subheading
        this.icon = data.icon
        this.results = data.results.map((result) => new DecreeResult(result))
    }
}

class DecreeResult {
    public readonly outcomes: string[]
    public readonly votes: number

    constructor(data: BlaseballElectionResult) {
        this.outcomes = data.outcomeStrings
        this.votes = data.overallVoteCount
    }
}

class Blessing {
    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly options: BlessingOption[]

    constructor(data: BlaseballElectionGroup) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.options = data.electionOptions.map((option) => new BlessingOption(option))
    }
}

class BlessingOption {
    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly subheading: string
    public readonly icon: string
    public readonly results: BlessingResult[]

    constructor(data: BlaseballElectionOption) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.subheading = data.subheading
        this.icon = data.icon
        this.results = data.results.map((result) => new BlessingResult(result))
    }
}

class BlessingResult {
    public readonly outcomes: string[]
    public readonly votes: number
    public readonly winner: { team: ElectionTeam, votes: number }
    public readonly topVoted: { team: ElectionTeam, votes: number }

    constructor(data: BlaseballElectionResult) {
        this.outcomes = data.outcomeStrings
        this.votes = data.overallVoteCount
        this.winner = {
            team: new ElectionTeam(data.winningTeam),
            votes: data.winningVoteCount,
        }
        this.topVoted = {
            team: new ElectionTeam(data.topVotedTeam),
            votes: data.topVoteCount,
        }
    }
}

class ElectionTeam {
    public readonly id: string
    public readonly name: string
    public readonly emoji: string
    public readonly primaryColor: string
    public readonly secondaryColor: string

    constructor(data: BlaseballTeam) {
        this.id = data.id
        this.name = data.name
        this.emoji = data.emoji
        this.primaryColor = data.primaryColor
        this.secondaryColor = data.secondaryColor
    }
}