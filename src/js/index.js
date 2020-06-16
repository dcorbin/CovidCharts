'use strict';

import {Settings, SettingsStore} from './settings';
import React  from 'react'
import ReactDom from 'react-dom'
import App from "./app";
import DATA_SOURCES, {dataSourceFromKey} from "./react/model/data_source";

function initialize() {
    let settings_store = new SettingsStore(window.localStorage)
    function loadOrCreateSettings() {
        let settings = settings_store.load()
        if (settings == null) {
            settings = Settings.defaultSettings()
        }
        settings_store.store(settings)
        return settings
    }

    let dataSourceKey = window.localStorage.getItem("dataSourceKey") || DATA_SOURCES[0].key
    ReactDom.render(<App
            initialDataSource={dataSourceFromKey(dataSourceKey)}
            initialSettings={loadOrCreateSettings()}
            saveSettings={(s) => settings_store.store(s)} />,
            document.getElementById("app"))
}


window.onload = initialize
