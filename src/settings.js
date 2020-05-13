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
       return JSON.parse(this.storage.getItem('settings'))
    }
}

export {Settings, SettingsStore}