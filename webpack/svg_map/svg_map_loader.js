// let LoaderUtils = require('loader-utils')
let SvgMapStore = require('./svg_map_store.js')
function loader(source, map, meta) {
    let name =this.resourcePath.replace(/.*\//, '').replace('.svg-map', '')
        SvgMapStore.singleton.register(name, source)
    return `exports.${name.toUpperCase()}_URL = "/api/maps/${name}.json";`;
}
module.exports = loader