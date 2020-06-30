import {normalizeDataFocusTabSettings} from "./settings";

const SETTINGS_KEY = 'settings.v3';
export default class SettingsStore {
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