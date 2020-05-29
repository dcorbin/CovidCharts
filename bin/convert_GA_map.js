let fs = require('fs'),
    xml2js = require('xml2js');

let baseDir = __dirname + '/..';

function generateMapJavaScript(xml) {
    function generateLocation(pathElement) {
        let id = pathElement.$.id
        return `
    {
        name: "${id}",
        id: "${id}",
        path: "${pathElement.$.d}",
    }`
    }

    let viewBox = "0 0 ${xml.svg.$.width} ${xml.svg.$.height}"
    if (xml.svg.$.viewBox) {
        viewBox = xml.svg.$.viewBox
    }
    return `export default {
    "label" : "Georgia",
    "viewBox": "${viewBox}",
    "locations": [ 
        ${xml.svg.g[0].path.map(generateLocation)} 
    ]
}`
}
function ensureDirectory(path) {
    path = baseDir + path
    try {
        fs.statSync(path)
    } catch (e) {
        fs.mkdirSync(path)
    }
}
let parser = new xml2js.Parser();
fs.readFile( baseDir + '/maps/GA.svg', function(err, data) {
    parser.parseString(data, function (err, result) {
        if (err === null) {
            ensureDirectory('/generated')
            ensureDirectory('/generated/maps')
            // console.log(generateMapJavaScript(result))
            fs.writeFileSync(baseDir + "/generated/maps/GA.js", generateMapJavaScript(result) )
        }
    });
});