'use strict';

import {Settings} from './settings';
import React  from 'react'
import ReactDom from 'react-dom'
import App from "./app";
import DATA_FOCUS_LIST, {dataFocusFromKey} from "./model/data_focus";
import SettingsStore from "./settings_store";
import persistentStateLoader from "./storage_util";

function initialize(event) {
    let settings_store = new SettingsStore(window.localStorage)
    function loadOrCreateSettings() {
        let settings = settings_store.load()
        if (settings == null) {
            settings = Settings.defaultSettings()
            settings_store.store(settings)
        }
        return settings
    }

    let dataFocusKey = persistentStateLoader("dataFocusKey", DATA_FOCUS_LIST[0].key, ["dataSourceKey"])
    ReactDom.render(<App
            initialDataFocus={dataFocusFromKey(dataFocusKey)}
            initialSettings={loadOrCreateSettings()}
            saveSettings={(s) => settings_store.store(s)} />,
            document.getElementById("app"))
}

window.onload = initialize
