import SettingsStore from "./settings_store";
import {Settings} from "./settings";
import persistentStateLoader from "./storage_util";

export default class SettingsManager {
    static create(focusList, localStorage) {
        return new SettingsManager(focusList, new SettingsStore(localStorage), persistentStateLoader)
    }
    constructor(focusList, settingsStore, stateLoader) {
        this.focusList = focusList
        this.settingsStore = settingsStore
        this.stateLoader = stateLoader
    }
    getAppSettings() {
        let settings = this.settingsStore.load()
        if (settings == null) {
            settings = Settings.defaultSettings()
        }
        let dataFocusKey = this.stateLoader ("dataFocusKey", this.focusList[0].key, ["dataSourceKey"])
        const dataFocus = this.focusList .find(s => s.key === dataFocusKey)

        return {
            dataFocus: dataFocus,
            settings: settings
        }
    }
    saveAppSettings(appSettings) {
        this.settingsStore.store(appSettings.settings)
    }
}