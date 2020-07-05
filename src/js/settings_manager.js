import SettingsStore from "./settings_store";
import {Settings} from "./settings";
import persistentStateLoader from "./storage_util";

const DATA_FOCUS_KEY = "dataFocusKey";

export default class SettingsManager {
    static create(focusList, localStorage) {
        return new SettingsManager(focusList, new SettingsStore(localStorage), persistentStateLoader, localStorage)
    }

    constructor(focusList, settingsStore, stateLoader, localStorage) {
        this.focusList = focusList
        this.settingsStore = settingsStore
        this.stateLoader = stateLoader
        this.localStorage = localStorage
    }

    getAppSettings() {
        let settings = this.settingsStore.load()
        if (settings == null) {
            settings = Settings.defaultSettings()
        }
        let dataFocusKey = this.stateLoader (DATA_FOCUS_KEY, this.focusList[0].key, ["dataSourceKey"])

        const dataFocus = this.focusList .find(s => s.key === dataFocusKey)

        return {
            dataFocus: dataFocus,
            settings: settings
        }
    }

    saveSettings(settings) {
        this.settingsStore.store(settings)
    }

    saveDataFocus(dataFocus) {
        this.localStorage.setItem(DATA_FOCUS_KEY, dataFocus.key)
    }
}