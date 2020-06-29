import QuickPick from "./model/quick_pick";
function normalizeDataFocusTabSettings(dataFocusSettings, outdatedSelectionPropertyName = null) {
    if (outdatedSelectionPropertyName && dataFocusSettings[outdatedSelectionPropertyName]) {
        dataFocusSettings.selectedRegions = dataFocusSettings[outdatedSelectionPropertyName]
        delete dataFocusSettings[outdatedSelectionPropertyName]
    }

    if (!dataFocusSettings.selectedRegions)
        dataFocusSettings.selectedRegions = []

    if (!dataFocusSettings.userQuickPicks)
        dataFocusSettings.userQuickPicks = []
    else {
        dataFocusSettings.userQuickPicks = dataFocusSettings.userQuickPicks.map(qpo => {
            return QuickPick.fromGenericObject(qpo);
        })
    }

    if (!dataFocusSettings.nullStrategy) {
        dataFocusSettings.nullStrategy = 'none'
    }
    if (!dataFocusSettings.movingAvgStrategy) {
        dataFocusSettings.movingAvgStrategy = 7
    }
    if (!dataFocusSettings.dataLinesId) {
        dataFocusSettings.dataLinesId = 'ALL'
    }
    if (!dataFocusSettings.verticalScaleType) {
        dataFocusSettings.verticalScaleType = 'linear'
    }
    if (!dataFocusSettings.activeTab) {
        dataFocusSettings.activeTab = 0
    }
    dataFocusSettings.selectedRegions = dataFocusSettings.selectedRegions.filter(e => e !== null)
    return dataFocusSettings
}

export class Settings {
    static defaultFocusSettings(regions) {
        return normalizeDataFocusTabSettings({
            selectedRegions: regions
        })
    }
    static defaultSettings() {
        return new Settings(
                Settings.defaultFocusSettings(['GA']),
                Settings.defaultFocusSettings([])
        )
    }

    constructor(covidTracking, georgia) {
        this.covidTracking = covidTracking
        this.georgia = georgia
    }
}

export function persistentStateLoader(primaryKey, defaultValue, ...legacyKeys) {
    let value = window.localStorage.getItem(primaryKey)
    if (value != null) {
        return value
    }

    legacyKeys.forEach(key => {
        let value = window.localStorage.getItem(key)
        if (value != null) {
            window.localStorage.setItem(primaryKey, value)
            window.localStorage.removeItem(key)
            return value
        }
    })
    return defaultValue
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
            normalizeDataFocusTabSettings(settings.georgia, 'counties')
            normalizeDataFocusTabSettings(settings.covidTracking, 'states')
            return settings
        }

        let item = this.storage.getItem(SETTINGS_KEY)
        if (item === null) {
            return null
        }
        return normalizeSettings(JSON.parse(item))
    }

}