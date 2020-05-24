'use strict';

import Clock from './util/clock'
import {Settings, SettingsStore} from './settings';
import React from 'react'
import CovidTrackingCom from "./covid_tracking_com/covid_tracking_com";
import ReadThroughCache from "./util/read_thru_cache";
import Footer from "./react/footer";
import ReactDom from 'react-dom'
import {StateRegionSpec} from "./states";
import ChartPanel from "./react/chart_panel";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import GeorgiaByCounty, {CountyRegionSpec} from "./GeorgiaByCounty";
import 'react-tabs/style/react-tabs.css';

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
    let georgiaDataProvider = new ReadThroughCache(1000 * 60 * 60, new Clock(), new GeorgiaByCounty())
    function createSettingsChangeHandler(panel) {
        return newTabSettings => {
            let settings = settings_store.load()
            settings[panel] = newTabSettings
            settings_store.store(settings)
        };
    }

    let activeTab = 0
    let json = window.localStorage.getItem("activeTab")
    if (json) { activeTab = JSON.parse(json)}
    ReactDom.render(<div>
            <Tabs defaultIndex={activeTab}
                  onSelect={index => {
                      window.localStorage.setItem("activeTab", JSON.stringify(index));
                      return true
                  }}>
                <TabList>
                    <Tab>USA</Tab>
                    <Tab>Georgia</Tab>
                </TabList>

                <TabPanel>
                    <ChartPanel dataProvider={covidTracking}
                                initialSelections={settings.covidTracking.states}
                                regionSpec={new StateRegionSpec()}
                                settings={settings.covidTracking}
                                columns={8}
                                onSettingsChange={createSettingsChangeHandler('covidTracking')}/>
                     <Footer source={<a href="https://covidtracking.com">covidtracking.com</a>}/>
                </TabPanel>
                <TabPanel>
                    <ChartPanel dataProvider={georgiaDataProvider}
                                initialSelections={settings.georgia.counties}
                                regionSpec={new CountyRegionSpec()}
                                settings={settings.georgia}
                                columns={10}
                                onSettingsChange={createSettingsChangeHandler('georgia')}/>
                    <Footer source={<a href="https://dph.georgia.gov/covid-19-daily-status-report">Georgia Department of Public Health</a>}/>
                </TabPanel>
            </Tabs>
        </div>,
        document.getElementById("app"))
}

window.onload = initialize
