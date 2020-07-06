class SvgMapStore {
    static singleton = new SvgMapStore()
    constructor() {
        this.svgContentByResourcePath = new Map()
    }

    register(name, svgContent) {
        this.svgContentByResourcePath.set(name, svgContent)
    }

    mapNames() {
        return this.svgContentByResourcePath.keys()
    }
    svgContentFor(name) {
        return this.svgContentByResourcePath.get(name)
    }
}

module.exports = SvgMapStore