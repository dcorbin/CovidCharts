import QuickPick from "./model/quick_pick";
function normalizeDataSourceTabSettings(dataSourceSettings, outdatedSelectionPropertyName = null) {
    if (outdatedSelectionPropertyName && dataSourceSettings[outdatedSelectionPropertyName]) {
        dataSourceSettings.selectedRegions = dataSourceSettings[outdatedSelectionPropertyName]
        delete dataSourceSettings[outdatedSelectionPropertyName]
    }

    if (!dataSourceSettings.selectedRegions)
        dataSourceSettings.selectedRegions = []

    if (!dataSourceSettings.userQuickPicks)
        dataSourceSettings.userQuickPicks = []
    else {
        dataSourceSettings.userQuickPicks = dataSourceSettings.userQuickPicks.map(qpo => {
            return QuickPick.fromGenericObject(qpo);
        })
    }

    if (!dataSourceSettings.nullStrategy) {
        dataSourceSettings.nullStrategy = 'none'
    }
    if (!dataSourceSettings.movingAvgStrategy) {
        dataSourceSettings.movingAvgStrategy = 7
    }
    if (!dataSourceSettings.dataLinesId) {
        dataSourceSettings.dataLinesId = 'ALL'
    }
    if (!dataSourceSettings.verticalScaleType) {
        dataSourceSettings.verticalScaleType = 'linear'
    }
    if (!dataSourceSettings.activeTab) {
        dataSourceSettings.activeTab = 0
    }
    dataSourceSettings.selectedRegions = dataSourceSettings.selectedRegions.filter(e => e !== null)
    return dataSourceSettings
}

export class Settings {
    static defaultTabSettings(regions) {
        return normalizeDataSourceTabSettings({
            selectedRegions: regions
        })
    }
    static defaultSettings() {
        return new Settings(
                Settings.defaultTabSettings(['GA']),
                Settings.defaultTabSettings([])
        )
    }

    constructor(covidTracking, georgia) {
        this.covidTracking = covidTracking
        this.georgia = georgia
    }
}

const SETTINGS_KEY = 'settings.v3';
export class SettingsStore {
    constructor(storage) {
        this.storage = storage
    }

    store(settings) {
        let json = JSON.stringify(settings, null, 2);
        this.storage.setItem(SETTINGS_KEY, json)
    }

    load() {
        function normalizeSettings(settings) {
            delete settings.georgia.states
            normalizeDataSourceTabSettings(settings.georgia, 'counties')
            normalizeDataSourceTabSettings(settings.covidTracking, 'states')
            return settings
        }

        let item = this.storage.getItem(SETTINGS_KEY)
        if (item === null) {
            return null
        }
        return normalizeSettings(JSON.parse(item))
    }

}