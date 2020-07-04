'use strict';

import React from 'react'
import DATA_FOCUS_LIST from "./model/data_focus";
import SettingsStore from "./settings_store";
import AppBootstrapper from "./app_bootstrapper";

function initialize(event) {
    new AppBootstrapper(new SettingsStore(window.localStorage),
            DATA_FOCUS_LIST,
            document.getElementById("app")).run()
}

window.onload = initialize
