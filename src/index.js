'use strict';

import {CovidTracking, CovidTrackingCache} from './covid_tracking'
import {chart_state_data} from "./charting";
import {Settings, SettingsStore} from './settings';
import React from 'react'
import StatePickList from "./react/state_pick_list";
import Chart from "react-google-charts";

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

    ReactDOM.render(
        <StatePickList initialState={initial_state} onSelectionChange={stateSelectionChanged}/>,
        document.querySelector('#control-panel')
    )
    function stateSelectionChanged(newValue) {
        ReactDOM.render(chart_state_data(cache.fetch(), newValue),
            document.getElementById("chart"))
        let settings = settings_store.load();
        settings.state = newValue
        settings_store.store(settings)
    }

    CovidTracking.fetch_covid_tracking_data_p(cache).then(unk => {
        ReactDOM.render(chart_state_data(cache.fetch(), initial_state),
            document.getElementById("chart"))
    })
}

window.onload = initialize
