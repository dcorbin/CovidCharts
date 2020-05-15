'use strict';

import Clock from './util/clock'
import {Settings, SettingsStore} from './settings';
import React from 'react'
import ByStateChartPanel from "./react/by_state_chart_panel";
import CovidTrackingCom from "./covid_tracking_com/covid_tracking_com";
import ReadThroughCache from "./util/read_thru_cache";
import Footer from "./react/footer";
import ReactDom from 'react-dom'

function initialize() {
    let settings_store = new SettingsStore(window.localStorage)
    function loadOrCreateSettings() {
        let settings = settings_store.load()
        if (settings == null) {
            settings = new Settings()
            settings_store.store(settings)
        }
        if (typeof settings.state === "string") {
            settings = new Settings()
            settings_store.store(settings)
        }
        return settings
    }
    let settings = loadOrCreateSettings();
    let initialStates = settings.states

    let covidTracking = new ReadThroughCache(1000 * 60 * 60, new Clock(), new CovidTrackingCom())
    ReactDom.render(<div>
                        <ByStateChartPanel dataProvider={covidTracking}
                                           initialStates={initialStates}
                                           onSettingsChange={newSettings => {settings_store.store(newSettings)}}
                                    />
                        <Footer/>
                    </div>,
        document.getElementById("app"))
}

window.onload = initialize
