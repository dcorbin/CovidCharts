class Settings {
    static defaultSettings() {
        return new Settings({states: ['GA']})
    }

    constructor(covidTracking) {
        this.covidTracking = covidTracking
    }
}

class SettingsStore {
    constructor(storage) {
        this.storage = storage
    }

    store(settings) {
        this.storage.setItem('settings.v2', JSON.stringify(settings))
    }

    load() {
        function handleOldSettings(json) {
            console.log("Migrating old settings: " + json)
            let oldSettings = JSON.parse(json)
            this.storage.removeItem('settings')
            return {
                covidTracking: {states: [oldSettings.state]}
            }
        }

        let item = this.storage.getItem('settings.v2')
        if (item === null) {
            let item = this.storage.getItem('settings')
            if (item === null) {
                return null
            } else {
                return handleOldSettings.bind(this)(item)
            }
        }
        return JSON.parse(item)
    }

}

export {Settings, SettingsStore}