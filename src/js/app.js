import DATA_FOCUS_LIST, {dataFocusFromKey} from "./model/data_focus";
import LabeledCombo from "./react/basic/labeled_combo";
import React, {useEffect} from "react";
import PropTypes from 'prop-types'
import NormalizedRecordSet from "./covid_tracking_com/normalized_record_set";
import './app.css'
import AppBody from "./app_body";
import useWindowDimensions from "./react/hooks/use_window_dimensions";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBlock from "./react/basic/error_block";
import SettingsManager from "./settings_manager";
import UrlManager from "./url/url_manager";
import LocationManager from "./web/location_manager";

const {useState} = require("react");

App.propTypes = {
    settingsManager: PropTypes.instanceOf(SettingsManager).isRequired,
    urlManager: PropTypes.instanceOf(UrlManager).isRequired,
    locationManager: PropTypes.instanceOf(LocationManager).isRequired
}

export default function App(props) {
    const appSettings =
        props.urlManager.settingsAdjustedForUrl(props.settingsManager.getAppSettings(), props.locationManager.getLocation())
    let [settings, setSettings]  = useState(appSettings.settings);
    let [dataFocus, setDataFocus] = useState(appSettings.dataFocus)
    let [normalizedRecordSet, setNormalizedRecordSet] = useState(NormalizedRecordSet.empty)
    const {width, height} = useWindowDimensions()
    useEffect(fetchData,[dataFocus])
    useEffect(monitorHistory, [])
    function monitorHistory() {
        const popstateEventListener = event => {
            const url = props.locationManager.getLocation();
            const appSettings =
                props.urlManager.settingsAdjustedForUrl({dataFocus: dataFocus, settings: settings}, url)
            setSettings(appSettings.settings)
            setDataFocus(appSettings.dataFocus)
        };
        window.addEventListener('popstate', popstateEventListener);
        return () => window.removeEventListener('popstate', popstateEventListener)
    }
    function fetchData() {
        let isSubscribed = true
        dataFocus.dataProvider.getData().then(recordSet => {
            if (isSubscribed)
                setNormalizedRecordSet(recordSet)
        })
        return () => isSubscribed = false
    }


    function updateLocationUrl(dataFocus, settings) {
        const appSettings = {dataFocus: dataFocus, settings: settings};
        const url = props.urlManager.buildUrl(appSettings);
        console.log(url)
        props.locationManager.setLocation(url)

    }

    function handleSettingsChange(newDataFocusSettings) {
        let newSettings = {...settings}
        newSettings[dataFocus.settingsKey] = newDataFocusSettings
        props.settingsManager.saveSettings(newSettings)
        setSettings(newSettings)
        updateLocationUrl(dataFocus, newSettings);
    }

    function handleDataFocusChange(key) {
        const dataFocus = dataFocusFromKey(key);
        setNormalizedRecordSet(NormalizedRecordSet.empty())
        props.settingsManager.saveDataFocus(dataFocus)
        setDataFocus(dataFocus)
        updateLocationUrl(dataFocus, settings)
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorBlock.callback}>
            <div className='App'>
                <div className='Header'>
                    <h1>{document.title}</h1>
                    <div className='DataFocus'>
                        <LabeledCombo label='Data Focus'
                                      initialValue={dataFocus.key}
                                      onChange={handleDataFocusChange}
                                      options={DATA_FOCUS_LIST.map(s => {
                                          return {value: s.key, label: s.name}
                                      })}
                        />
                    </div>
                </div>
                <AppBody
                    height={height - 111}
                    recordSet={normalizedRecordSet}
                    dataFocus={dataFocus}
                    dataFocusSettings={settings[dataFocus.settingsKey]}
                    onSettingsChange={handleSettingsChange}
                />
            </div>
        </ErrorBoundary>
    )

}
