'use strict';

import React from 'react'
import DATA_FOCUS_LIST from "./model/data_focus";
import AppBootstrapper from "./app_bootstrapper";
import SettingsManager from "./settings_manager";
import UrlManager from "./url/url_manager";
import UrlParser from "./url/url_parser";
import location from './web/location'

function initialize(event) {
    const urlParser = new UrlParser(DATA_FOCUS_LIST);
    const urlManager = new UrlManager(urlParser, location);
    const settingsManager = SettingsManager.create(DATA_FOCUS_LIST, window.localStorage);
    const targetElement = document.getElementById("app");
    new AppBootstrapper(
            targetElement,
            settingsManager,
            urlManager
    ).run()
}

window.onload = initialize
