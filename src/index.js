'use strict';

import {CovidTracking, CovidTrackingCache} from './covid_tracking'
import {chart_state_data} from "./charting";
import {Settings, SettingsStore} from './settings';
import React from 'react'
import StatePickList from "./react/state_pick_list";
import Chart from "react-google-charts";
import ChartPanel from "./react/chart_panel";

function initialize() {
    let settings_store = new SettingsStore(window.localStorage)
    function loadOrCreateSettings() {
        let settings = settings_store.load()
        if (settings == null) {
            settings = new Settings()
            settings_store.store(settings)
        }
        return settings
    }
    let settings = loadOrCreateSettings();
    let cache = new CovidTrackingCache()
    let initial_state = settings.state

    CovidTracking.fetch_covid_tracking_data_p(cache).then(unk => {
        ReactDOM.render(
            <ChartPanel dataSource={cache.fetch()}
                        initialState={initial_state}
                        onSettingsChange={newSettings => {settings_store.store(newSettings)}}
            />,
            document.getElementById("app"))
    })
}

window.onload = initialize
