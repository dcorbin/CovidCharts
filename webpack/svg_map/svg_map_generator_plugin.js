const { RawSource } = require('webpack-sources')
const xml2js = require('xml2js')

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

class SvgMapGeneratorPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        let options = this.options
        function normalizerFor(name) {
            let normalizer = options.normalizers.find(n => {
                return n.test.test(name);
            });

            if (normalizer) {
                return require(normalizer.file)
            }
            return null
        }

        let parser = new xml2js.Parser()
        compiler.hooks.thisCompilation.tap('SvgMapGenerator', (compilation) => {
            compilation.hooks.additionalAssets.tap('SvgMapGenerator', () => {
                let singleton = SvgMapStore.singleton;
                for (let name of singleton.mapNames()) {
                    const resourcePath = `api/maps/${name}.json`
                    let svg = singleton.svgContentFor(name)
                    parser.parseString(svg, function (err, parsedXml) {
                        if (err === null) {
                            let normalizer = normalizerFor(name);
                            if (!normalizer) {
                                console.log(`ERROR: SvgMapGenerator ${name} has no normalizer`)
                            } else {
                                let json = JSON.stringify(normalizer(parsedXml), null, 4)
                                compilation.emitAsset(resourcePath, new RawSource(json))
                            }
                        } else {
                            console.log(`ERROR: SvgMapGenerator error parsing XML for ${name}`)
                        }
                    })
                }
            })
        })
    }
}

function loader(source, map, meta) {
    let name =this.resourcePath.replace(/.*\//, '').replace('.svg-map', '')
    SvgMapStore.singleton.register(name, source)
    return `exports.${name.toUpperCase()}_URL = "/api/maps/${name}.json";`;
}

module.exports.SvgMapGeneratorPlugin = SvgMapGeneratorPlugin
module.exports.default = loader