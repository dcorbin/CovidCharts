class Settings {
    static defaultSettings() {
        return new Settings(
            {selectedRegions: ['GA'], nullStrategy: 'none', userQuickPicks: []},
            {selectedRegions: [], nullStrategy: 'none', userQuickPicks: []})
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
        this.storage.setItem('settings.v3', JSON.stringify(settings))
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

                if (!tabSettings.nullStrategy) {
                    tabSettings.nullStrategy = 'none'
                }
                tabSettings.selectedRegions = tabSettings.selectedRegions.filter(e => e !== null)
            }
            delete settings.georgia.states
            normalizeTabSettings(settings.georgia, 'counties')
            normalizeTabSettings(settings.covidTracking, 'states')
            return settings
        }

        function handleOldSettings(json) {
            console.log("Migrating old settings: " + json)
            let oldSettings = JSON.parse(json)
            this.storage.removeItem('settings')
            return {
                covidTracking: {states: [oldSettings.state]}
            }
        }

        let item = this.storage.getItem('settings.v3')
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