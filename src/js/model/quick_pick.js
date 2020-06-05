export default class QuickPick {

    constructor(key, name, regions = null, regionsFilter=null) {
        if (regions === null && this.regionsFilter === null) {
            console.log("QuickPick: invalid construction - must specify regions or regionsFilter")
        }
        this.key = key
        this.name = name
        this.text = name
        this.regions = regions
        this.regionsFilter = regionsFilter
    }
}

QuickPick.NONE = new QuickPick("none", "None", [])
