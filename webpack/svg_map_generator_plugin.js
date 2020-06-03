let SvgMapStore = require('./svg_map_store.js')
const { RawSource } = require('webpack-sources')
const xml2js = require('xml2js')



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

module.exports = SvgMapGeneratorPlugin