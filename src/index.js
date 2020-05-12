'use strict';

import Clock from './util/clock'
import {Settings, SettingsStore} from './settings';
import React from 'react'
import ChartPanel from "./react/chart_panel";
import CovidTrackingCom from "./covid_tracking_com/covid_tracking_com";
import ReadThroughCache from "./util/read_thru_cache";
import Footer from "./react/footer";

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
    let initial_state = settings.state

    let covidTracking = new ReadThroughCache(1000 * 60 * 60, new Clock(), new CovidTrackingCom())
    ReactDOM.render(<div>
                        <ChartPanel dataProvider={covidTracking}
                                    initialState={initial_state}
                                    onSettingsChange={newSettings => {settings_store.store(newSettings)}}
                                    />
                        <Footer/>
                    </div>,
        document.getElementById("app"))
}

window.onload = initialize
