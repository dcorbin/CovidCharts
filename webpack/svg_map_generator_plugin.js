let SvgMapStore = require('./svg_map_store.js')
const { RawSource } = require('webpack-sources')
const xml2js = require('xml2js')

function normalizeGAXml(xml) {
    function generateLocation(pathElement) {
        let id = pathElement.$.id
        return {
            name: id,
            id: id,
            path: pathElement.$.d
        }
    }

    let viewBox = "0 0 ${xml.svg.$.width} ${xml.svg.$.height}"
    if (xml.svg.$.viewBox) {
        viewBox = xml.svg.$.viewBox
    }
    return {
        label : "Georgia",
        viewBox: viewBox,
        locations: xml.svg.g[0].path.map(generateLocation)
    }
}
const XML_CONVERTS = {
    'GA': normalizeGAXml
}

class SvgMapGeneratorPlugin {

    apply(compiler) {
        let parser = new xml2js.Parser()
        compiler.hooks.thisCompilation.tap('SvgMapGenerator', (compilation) => {
            compilation.hooks.additionalAssets.tap('SvgMapGenerator', () => {
                let singleton = SvgMapStore.singleton;
                for (let name of singleton.mapNames()) {
                    console.log("SVGMAP: " + name)
                    const resourcePath = `api/maps/${name}.json`
                    let svg = singleton.svgContentFor(name)
                    parser.parseString(svg, function (err, parsedXml) {
                        if (err === null) {
                            let normalizer = XML_CONVERTS[name];
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