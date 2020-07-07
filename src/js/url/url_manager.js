
function copySettings(newAppSettings, appSettings) {
    newAppSettings.settings = {}
    Object.keys(appSettings.settings).forEach(key => {
        newAppSettings.settings[key] = {...appSettings.settings[key]}
    })
}

export default class UrlManager {
    constructor(urlParser, locationFinder) {
        this.urlParser = urlParser
        this.locationFinder = locationFinder
    }

    settingsAdjustedForUrl(appSettings, url) {
        const parseResult = this.urlParser.parse(url)
        let newAppSettings = {}
        if (!parseResult.dataFocus)
            return appSettings

        newAppSettings.dataFocus = parseResult.dataFocus
        copySettings(newAppSettings, appSettings);

        const parseResultKeys = Object.keys(parseResult).filter(k => k !== 'dataFocus');
        const settingsKey = parseResult.dataFocus.settingsKey;
        parseResultKeys.forEach(key => {
            newAppSettings.settings[settingsKey][key] = parseResult[key]
        })

        return newAppSettings;
    }

    buildUrl(appSettings) {
        let url = new URL(this.locationFinder())
        const dataFocus = appSettings.dataFocus;
        let parts = []

        function addPair(key, value) {
            parts.push(key)
            parts.push(value)
        }

        const focusSettings = appSettings.settings[dataFocus.settingsKey]
        addPair( 'dataFocus',  dataFocus.key);
        addPair( 'activeTab',  focusSettings.activeTab);
        if (focusSettings.activeTab === 0) {
            addPair( 'dataLinesId',        focusSettings.dataLinesId);
            addPair( 'movingAvgStrategy',  focusSettings.movingAvgStrategy);
            addPair( 'nullStrategy',       focusSettings.nullStrategy);
            addPair( 'selectedRegions',    focusSettings.selectedRegions);
            addPair( 'verticalScaleType',  focusSettings.verticalScaleType);
        } else {
            addPair( 'ranker',     focusSettings.ranker);
        }

        const result = new URL(url.origin)
        result.hash = parts.join('/')

        return result.href;
    }
}