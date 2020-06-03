export default class DataLine {
    constructor(label, vAxis, color, sourceProperty, sevenDayAvgValueExtractor) {
        this.label = label
        this.vAxis = vAxis
        this.color = color
        this.sourceProperty = sourceProperty
        this.sevenDayAvgValueExtractor = sevenDayAvgValueExtractor
    }


}