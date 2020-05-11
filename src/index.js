'use strict';

import {CovidTracking, CovidTrackingCache} from './covid_tracking'
import {chart_state_data} from "./charting";
import {Settings, SettingsStore} from './settings';
import React from 'react'
import StatePickList from "./react/state_pick_list";


function objectProperties(obj) {
    var result = new Set()
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            result.add(i)
        }
    }
    return result;
}

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

    ReactDOM.render(<StatePickList initialState={initial_state} onSelectionChange={
        newValue => {
            console.log("SelChange: " + newValue);
            chart_state_data(cache.fetch(), newValue);
            let settings = settings_store.load();
            settings.state = newValue
            settings_store.store(settings)

        }}/>  ,
        document.querySelector('#control-panel'))
    CovidTracking.fetch_covid_tracking_data_p(cache).then(unk => {
        chart_state_data(cache.fetch(), initial_state)

        let data_states = objectProperties(cache.fetch())
    })
}



window.onload = initialize
