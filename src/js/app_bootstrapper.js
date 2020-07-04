import React from "react";
import {Settings} from "./settings";
import ReactDom from "react-dom";
import persistentStateLoader from "./storage_util";
import App from "./app";

export default class AppBootstrapper {
    constructor(settingsStore, focusList, targetElement) {
        this.settingsStore = settingsStore
        this.focusList = focusList
        this.targetElement = targetElement
    }
    run() {
        function loadOrCreateSettings(settingsStore) {
            let settings = settingsStore.load()
            if (settings == null) {
                settings = Settings.defaultSettings()
                settingsStore.store(settings)
            }
            return settings
        }

        let dataFocusKey = persistentStateLoader("dataFocusKey", this.focusList[0].key, ["dataSourceKey"])
        const dataFocus = this.focusList .find(s => s.key === dataFocusKey)
        ReactDom.render(<App
                initialDataFocus={dataFocus}
                initialSettings={loadOrCreateSettings(this.settingsStore)}
                saveSettings={s => this.settingsStore.store(s)} />,
            this.targetElement)

    }
}
