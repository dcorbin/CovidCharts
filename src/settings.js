class Settings {
    constructor() {
        this.states = ['GA']
    }
}

class SettingsStore {
    constructor(storage) {
        this.storage = storage
    }

    store(settings) {
        this.storage.setItem('settings', JSON.stringify(settings))
    }

    load() {
        let item = this.storage.getItem('settings');
        if (item === null)
            return null
        return JSON.parse(item)
    }
}

export {Settings, SettingsStore}