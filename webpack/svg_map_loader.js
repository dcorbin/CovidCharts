// import { getOptions } from 'loader-utils';
let SvgMapStore = require('./svg_map_store.js')
function loader(source, map, meta) {
    // const options = getOptions(this);
    let name =this.resourcePath.replace(/.*\//, '').replace('.svg', '')
        SvgMapStore.singleton.register(name, source)
    return `exports.${name.toUpperCase()}_URL = "/api/maps/${name}.json";`;
}
module.exports = loader