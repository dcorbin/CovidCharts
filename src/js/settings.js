import QuickPick from "./model/quick_pick";

class Settings {
    static defaultTabSettings(regions) {
        return {
            selectedRegions: regions,
            nullStrategy: 'none',
            userQuickPicks: [],
            movingAvgStrategy: 7,
            dataLinesId: 'ALL',
            verticalScaleType: 'linear'
        }
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

class SettingsStore {
    constructor(storage) {
        this.storage = storage
    }

    store(settings) {
        let json = JSON.stringify(settings, null, 2);
        this.storage.setItem('initialSettings.v3', json)
    }

    load() {
        function ensureSettingsCurrent(settings) {
            function normalizeTabSettings(tabSettings, outdatedSelectionProperties) {
                if (tabSettings[outdatedSelectionProperties]) {
                    tabSettings.selectedRegions = tabSettings[outdatedSelectionProperties]
                    delete tabSettings[outdatedSelectionProperties]
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
            delete settings.georgia.states
            normalizeTabSettings(settings.georgia, 'counties')
            normalizeTabSettings(settings.covidTracking, 'states')
            return settings
        }

        function handleOldSettings(json) {
            console.log("Migrating old initialSettings: " + json)
            let oldSettings = JSON.parse(json)
            this.storage.removeItem('settings')
            return {
                covidTracking: {states: [oldSettings.state]}
            }
        }

        let item = this.storage.getItem('initialSettings.v3')
        if (item === null) {
            let item = this.storage.getItem('settings')
            if (item === null) {
                return null
            } else {
                return ensureSettingsCurrent(handleOldSettings.bind(this)(item))
            }
        }
        return ensureSettingsCurrent(JSON.parse(item))
    }

}

export {Settings, SettingsStore}