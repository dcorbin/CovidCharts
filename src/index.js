'use strict';

import Clock from './util/clock'
import {Settings, SettingsStore} from './settings';
import React from 'react'
import CovidTrackingChartPanel from "./react/covid_tracking_chart_panel";
import CovidTrackingCom from "./covid_tracking_com/covid_tracking_com";
import ReadThroughCache from "./util/read_thru_cache";
import Footer from "./react/footer";
import ReactDom from 'react-dom'

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
    let settings = loadOrCreateSettings();

    let covidTracking = new ReadThroughCache(1000 * 60 * 60, new Clock(), new CovidTrackingCom())
    ReactDom.render(<div>
                        <CovidTrackingChartPanel dataProvider={covidTracking}
                                                 settings={settings.covidTracking}
                                                 onSettingsChange={newCovidTrackingSettings => {
                                                     let settings = settings_store.load()
                                                     settings.covidTracking =  newCovidTrackingSettings
                                                     settings_store.store(settings)
                                                 }}
                                    />
                        <Footer/>
                    </div>,
        document.getElementById("app"))
}

window.onload = initialize
