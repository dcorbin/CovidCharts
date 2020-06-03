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
module.exports = normalizeGAXml