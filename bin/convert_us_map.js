let fs = require('fs'),
    xml2js = require('xml2js');

let baseDir = __dirname + '/..';

function generateMapJavaScript(xml) {
    function generateLocation(pathElement) {
        return `
    {
        name: "${pathElement.title[0]}",
        id: "${pathElement.$.id}",
        path: "${pathElement.$.d}",
    }`
    }
    return `export default {
    "label" : "${xml.svg.title[0]}",
    "viewBox": "${xml.svg.$.viewBox}",
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
fs.readFile( baseDir + '/maps/US.svg', function(err, data) {
    parser.parseString(data, function (err, result) {
        if (err === null) {
            ensureDirectory('/generated')
            ensureDirectory('/generated/maps')
            fs.writeFileSync(baseDir + "/generated/maps/US.js", generateMapJavaScript(result) )
        }
    });
});