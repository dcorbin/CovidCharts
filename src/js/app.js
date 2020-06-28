import DATA_FOCUS_LIST, {dataFocusFromKey} from "./react/model/data_focus";
import LabeledCombo from "./react/basic/labeled_combo";
import React, {useEffect} from "react";
import PropTypes from 'prop-types'
import NormalizedRecordSet from "./covid_tracking_com/normalized_record_set";
import './app.css'
import AppBody from "./app_body";
import useWindowDimensions from "./react/hooks/use_window_dimensions";

const {useState} = require("react");

App.propTypes = {
    initialSettings: PropTypes.object.isRequired,
    saveSettings: PropTypes.func.isRequired,
    initialDataFocus: PropTypes.object.isRequired
}

export default function App(props) {
    let [settings, setSettings]  = useState(props.initialSettings);
    let [dataFocus, setDataFocus] = useState(props.initialDataFocus)
    let [normalizedRecordSet, setNormalizedRecordSet] = useState(NormalizedRecordSet.empty)
    let [populationMap, setPopulationMap] = useState(new Map())
    const {width, height} = useWindowDimensions()

    function fetchCovidData() {
        let isSubscribed = true
        dataFocus.dataProvider.getData().then(recordSet => {
            if (isSubscribed)
                setNormalizedRecordSet(recordSet)
        })
        return () => isSubscribed = false
    }
    function fetchPopulationData() {
        let isSubscribed = true
        dataFocus.populationLoader.getData().then(populationMap => {
            if (isSubscribed)
                setPopulationMap(populationMap)
        })
        return () => isSubscribed = false
    }

    function handleSettingsChange(newDataFocusSettings) {
        let newSettings = {...settings}
        newSettings[dataFocus.settingsKey] = newDataFocusSettings
        props.saveSettings(newSettings)
        setSettings(newSettings)
    }

    useEffect(fetchCovidData,[dataFocus])
    // useEffect(fetchPopulationData,[dataFocus])

    return (
        <div className='App'>
            <div className='Header'>
                <h1>{document.title}</h1>
                <div className='DataFocus'>
                    <LabeledCombo label='Data Focus'
                                  initialValue={dataFocus.key}
                                  onChange={key => {
                                      setNormalizedRecordSet(NormalizedRecordSet.empty())
                                      setDataFocus(dataFocusFromKey(key))
                                      window.localStorage.setItem("dataFocusKey", key);
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
                dataFocus={dataFocus}
                dataFocusSettings={settings[dataFocus.settingsKey]}
                onSettingsChange={handleSettingsChange}
            />
        </div>
    )

}
