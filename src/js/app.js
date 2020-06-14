import ReadThroughCache from "./util/read_thru_cache";
import Clock from "./util/clock";
import CovidTrackingCom from "./covid_tracking_com/covid_tracking_com";
import GeorgiaByCounty from "./subject/georgia/GeorgiaByCounty";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ChartPanel from "./react/chart_panel";
import {StateRegionSpec} from "./subject/us/states";
import Footer from "./react/footer";
import {CountyRegionSpec} from "./subject/georgia/county_spec";
import 'react-tabs/style/react-tabs.css';
import React, {useState} from "react";
import PropTypes from 'prop-types'

export default function App(props) {
    let [settings, setSettings]  = useState(props.initialSettings);
    let covidTracking = new ReadThroughCache(1000 * 60 * 60, new Clock(), new CovidTrackingCom())
    let georgiaDataProvider = new ReadThroughCache(1000 * 60 * 60, new Clock(), new GeorgiaByCounty())

    function createSettingsChangeHandler(panel) {
        return newTabSettings => {
            let newTotalSettings = Object.assign({}, settings)
            newTotalSettings[panel] = newTabSettings
            setSettings(newTotalSettings)
            props.saveSettings(newTotalSettings)
        };
    }

    return <div>
        <h1>{document.title}</h1>
        <Tabs defaultIndex={props.initialTab}
              onSelect={index => {
                  window.localStorage.setItem("activeTab", JSON.stringify(index));
                  return true
              }}>
            <TabList>
                <Tab>United States</Tab>
                <Tab>Georgia</Tab>
            </TabList>

            <TabPanel>
                <ChartPanel dataProvider={covidTracking}
                            regionSpec={new StateRegionSpec()}
                            settings={settings.covidTracking}
                            columns={6}
                            onSettingsChange={createSettingsChangeHandler('covidTracking')}/>
                <Footer source={<a href="https://covidtracking.com">covidtracking.com</a>}/>
            </TabPanel>
            <TabPanel>
                <ChartPanel dataProvider={georgiaDataProvider}
                            regionSpec={new CountyRegionSpec()}
                            settings={settings.georgia}
                            columns={7}
                            onSettingsChange={createSettingsChangeHandler('georgia')}/>
                <Footer source={<a href="https://dph.georgia.gov/covid-19-daily-status-report">Georgia Department of Public Health</a>}/>
            </TabPanel>
        </Tabs>
    </div>
}

App.propTypes = {
    initialSettings: PropTypes.object.isRequired,
    saveSettings: PropTypes.func.isRequired,
    initialTab: PropTypes.number.isRequired

}
