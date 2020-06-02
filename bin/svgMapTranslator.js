let fs = require('fs'),
    xml2js = require('xml2js');

let baseDir = __dirname + '/..';

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

function ensureDirectory(path) {
    path = baseDir + path
    try {
        fs.statSync(path)
    } catch (e) {
        fs.mkdirSync(path)
    }
}

function convertSvgMap(svgMapProjectPath, generator) {
    ensureDirectory('/generated/api')
    ensureDirectory('/generated/api/maps')
    let parser = new xml2js.Parser();
    let svgMapPath = baseDir + svgMapProjectPath;
    let filename = svgMapProjectPath.replace(/.*\//, '')
    let baseFilename = filename.replace('.svg', '')
    let svgJsonPath = baseDir + '/generated/api/maps/' + baseFilename + '.json'
    let svg = fs.readFileSync(svgMapPath)
    parser.parseString(svg, function (err, result) {
        if (err === null) {
            fs.writeFileSync(svgJsonPath,
                JSON.stringify(generator(result), null, 4))
        }
    });
}
convertSvgMap('/maps/GA.svg', normalizeGAXml);
convertSvgMap('/maps/US.svg', normalizeUsXml);