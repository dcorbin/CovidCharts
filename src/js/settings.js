import QuickPick from "./model/quick_pick";
function normalizeTabSettings(tabSettings, outdatedSelectionPropertyName = null) {
    if (outdatedSelectionPropertyName && tabSettings[outdatedSelectionPropertyName]) {
        tabSettings.selectedRegions = tabSettings[outdatedSelectionPropertyName]
        delete tabSettings[outdatedSelectionPropertyName]
    }

    if (!tabSettings.selectedRegions)
        tabSettings.selectedRegions = []

    if (!tabSettings.userQuickPicks)
        tabSettings.userQuickPicks = []
    else {
        tabSettings.userQuickPicks = tabSettings.userQuickPicks.map(qpo => {
            return QuickPick.fromGenericObject(qpo);
        })
    }

    if (!tabSettings.nullStrategy) {
        tabSettings.nullStrategy = 'none'
    }
    if (!tabSettings.movingAvgStrategy) {
        tabSettings.movingAvgStrategy = 7
    }
    if (!tabSettings.dataLinesId) {
        tabSettings.dataLinesId = 'ALL'
    }
    if (!tabSettings.verticalScaleType) {
        tabSettings.verticalScaleType = 'linear'
    }
    tabSettings.selectedRegions = tabSettings.selectedRegions.filter(e => e !== null)
}

export class Settings {
    static defaultTabSettings(regions) {
        return normalizeTabSettings({
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

const SETTINGS_KEY = 'initialSettings.v3';
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
            normalizeTabSettings(settings.georgia, 'counties')
            normalizeTabSettings(settings.covidTracking, 'states')
            return settings
        }

        let item = this.storage.getItem(SETTINGS_KEY)
        if (item === null) {
            return null
        }
        return normalizeSettings(JSON.parse(item))
    }

}