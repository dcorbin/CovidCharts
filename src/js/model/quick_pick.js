export default class QuickPick {

    static createStatic(key, name, regions) {
        return new QuickPick({
            key: key, name: name, regions: regions, regionsFilter: null, userManaged: false
        })
    }
    static createUserManaged(key, name, regions) {
        return new QuickPick({
            key: key, name: name, regions: regions, regionsFilter: null, userManaged: true
        })
    }
    static createDynamic(key, name, regionsFilter) {
        return new QuickPick({
            key: key, name: name, regions: null, regionsFilter: regionsFilter, userManaged: false
        })
    }
    static fromGenericObject(obj) {
        return new QuickPick(obj)
    }
    constructor(obj) {
        if (obj.regions === null && obj.regionsFilter === null) {
            console.log("QuickPick: invalid construction - must specify regions or regionsFilter")
        }
        Object.assign(this, obj)
    }
}

QuickPick.NONE = QuickPick.createStatic("none", "None", [])
