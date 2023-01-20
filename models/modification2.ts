import { BlaseballModification } from "@models/api2"

export default class Modification {
    public readonly name: string
    public readonly description: string
    public readonly icon: string
    
    public readonly color: string
    public readonly backgroundColor: string
    public readonly textColor: string

    constructor(data: BlaseballModification) {
        this.name = data.name
        this.description = data.description
        this.icon = data.icon

        this.color = data.color
        this.backgroundColor = data.backgroundColor
        this.textColor = data.textColor
    }
}
