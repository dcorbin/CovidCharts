function normalizeUsXml(xml) {
    function generateLocation(pathElement) {
        return {
            name: pathElement.title[0],
            id: pathElement.$.id,
            path: pathElement.$.d
        }
    }

    return {
        label : xml.svg.title[0],
        viewBox: xml.svg.$.viewBox,
        locations: xml.svg.g[0].path.map(generateLocation)
    }
}
module.exports = normalizeUsXml