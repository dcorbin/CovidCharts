class Settings {
    static defaultSettings() {
        return new Settings({states: ['GA']},  {counties: [], nullStrategy: 'none'})
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
            if (!settings.covidTracking.nullStrategy) {
                settings.covidTracking.nullStrategy = 'none'
            }
            if (settings.covidTracking) {
                settings.covidTracking.states = settings.covidTracking.states.filter(e => e !== null)
            }
            if (!settings.georgia) {
                settings.georgia = {counties: [], nullStrategy: 'none'}
            }
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