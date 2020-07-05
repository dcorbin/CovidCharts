'use strict';

import React from 'react'
import DATA_FOCUS_LIST from "./model/data_focus";
import AppBootstrapper from "./app_bootstrapper";
import SettingsManager from "./settings_manager";

function initialize(event) {
    new AppBootstrapper(
            document.getElementById("app"),
            SettingsManager.create(DATA_FOCUS_LIST, window.localStorage)
    ).run()
}

window.onload = initialize
