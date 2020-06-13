'use strict';

import {Settings, SettingsStore} from './settings';
import React  from 'react'
import ReactDom from 'react-dom'
import App from "./app";

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

    let activeTab = 0
    let json = window.localStorage.getItem("activeTab")
    if (json) { activeTab = JSON.parse(json)}
    ReactDom.render(<App
        initialTab={activeTab}
        initialSettings={loadOrCreateSettings()}
        saveSettings={(s) => settings_store.store(s)} />,
        document.getElementById("app"))
}


window.onload = initialize
