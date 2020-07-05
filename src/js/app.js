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
import {TabPanel} from "react-tabs";
import SettingsManager from "./settings_manager";

const {useState} = require("react");

App.propTypes = {
    settingsManager: PropTypes.instanceOf(SettingsManager)
}

export default function App(props) {
    const appSettings = props.settingsManager.getAppSettings();
    let [settings, setSettings]  = useState(appSettings.settings);
    let [dataFocus, setDataFocus] = useState(appSettings.dataFocus)
    let [normalizedRecordSet, setNormalizedRecordSet] = useState(NormalizedRecordSet.empty)
    let [populationMap, setPopulationMap] = useState(new Map())
    const {width, height} = useWindowDimensions()

    function fetchData() {
        let isSubscribed = true
        function fetchPopulationData() {
            dataFocus.populationLoader.getData().then(populationMap => {
                if (isSubscribed)
                    setPopulationMap(populationMap)
            })
        }
        dataFocus.dataProvider.getData().then(recordSet => {
            if (isSubscribed)
                setNormalizedRecordSet(recordSet)
        }).then(() => fetchPopulationData())
        return () => isSubscribed = false
    }


    function handleSettingsChange(newDataFocusSettings) {
        let newSettings = {...settings}
        newSettings[dataFocus.settingsKey] = newDataFocusSettings
        props.settingsManager.saveSettings(newSettings)
        setSettings(newSettings)
    }

    useEffect(fetchData,[dataFocus])

    return (
        <ErrorBoundary FallbackComponent={ErrorBlock.callback}>
            <div className='App'>
                <div className='Header'>
                    <h1>{document.title}</h1>
                    <div className='DataFocus'>
                        <LabeledCombo label='Data Focus'
                                      initialValue={dataFocus.key}
                                      onChange={key => {
                                          const dataFocus = dataFocusFromKey(key);
                                          setNormalizedRecordSet(NormalizedRecordSet.empty())
                                          props.settingsManager.saveDataFocus(dataFocus)
                                          setDataFocus(dataFocus)
                                      }}
                                      options={DATA_FOCUS_LIST.map(s => {
                                          return {value: s.key, label: s.name}
                                      })}
                        />
                    </div>
                </div>
                <AppBody
                    height={height - 111}
                    recordSet={normalizedRecordSet}
                    populationMap={populationMap}
                    dataFocus={dataFocus}
                    dataFocusSettings={settings[dataFocus.settingsKey]}
                    onSettingsChange={handleSettingsChange}
                />
            </div>
        </ErrorBoundary>
    )

}
