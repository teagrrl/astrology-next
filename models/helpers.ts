export const scaleColorNames = ["Terrible", "Bad", "Poor", "Okay", "Good", "Great", "Exceptional", "Elite", "Super Elite"]
export const defaultScaleColors = ["#ef4444", "#fb923c", "#fcd34d", "#bef264", "#86efac", "#2dd4bf", "#93c5fd", "#c4b5fd", "#e879f9"]

export function removeDiacritics(slug: string) {
	return slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function hexToRGBA(color?: string, alpha?: number) {
    if(!color) return color
    if(color.startsWith("#")) {
        color = color.slice(1)
    }
    if(!alpha) { 
        alpha = 0.6
    } else if(alpha > 1) {
        alpha = 1
    } else if(alpha < 0) {
        alpha = 0
    }
    return `rgba(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4), 16)}, ${alpha})`
}

export function range(num: number) {
    return Array.from(Array(num).keys())
}