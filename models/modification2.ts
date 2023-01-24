import { BlaseballModification } from "@models/api2"

export default class Modification {
    public readonly name: string
    public readonly description?: string
    public readonly icon?: string
    
    public readonly color?: string
    public readonly backgroundColor?: string
    public readonly textColor?: string

    constructor(data: BlaseballModification) {
        this.name = data.name[0].toUpperCase() + data.name.substring(1) // why joel
        this.description = data.description ?? undefined
        this.icon = data.icon ?? undefined

        this.color = data.color ?? undefined
        this.backgroundColor = data.backgroundColor ?? undefined
        this.textColor = data.textColor ?? undefined
    }
}
