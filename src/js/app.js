import DATA_SOURCES, {dataSourceFromKey} from "./react/model/data_source";
import LabeledCombo from "./react/basic/labeled_combo";
import React, {useEffect} from "react";
import PropTypes from 'prop-types'
import NormalizedRecordSet from "./covid_tracking_com/normalized_record_set";
import './app.css'
import AppBody from "./app_body";

const {useState} = require("react");

App.propTypes = {
    initialSettings: PropTypes.object.isRequired,
    saveSettings: PropTypes.func.isRequired,
    initialDataSource: PropTypes.object.isRequired
}

export default function App(props) {
    let [settings, setSettings]  = useState(props.initialSettings);
    let [dataSource, setDataSource] = useState(props.initialDataSource)
    let [normalizedRecordSet, setNormalizedRecordSet] = useState(NormalizedRecordSet.empty)

    function fetchData() {
        let isSubscribed = true
        dataSource.dataProvider.getData().then(recordSet => {
            if (isSubscribed)
                setNormalizedRecordSet(recordSet)
        })
        return () => isSubscribed = false
    }

    function handleSettingsChange(newDataSourceSettings) {
        let newSettings = {...settings}
        newSettings[dataSource.settingsKey] = newDataSourceSettings
        props.saveSettings(newSettings)
        setSettings(newSettings)
    }

    useEffect(fetchData,[dataSource])

    return (
        <div className='App'>
            <div className='Header'>
                <h1>{document.title}</h1>
                <div className='DataFocus'>
                    <LabeledCombo label='Data Focus'
                                  initialValue={dataSource.key}
                                  onChange={key => {
                                      setNormalizedRecordSet(NormalizedRecordSet.empty())
                                      setDataSource(dataSourceFromKey(key))
                                      window.localStorage.setItem("dataSourceKey", key);
                                  }}
                                  options={DATA_SOURCES.map(s => {
                                      return {value: s.key, label: s.name}
                                  })}
                    />
                </div>
            </div>
            <AppBody
                headerHeight={100}
                recordSet={normalizedRecordSet}
                dataSource={dataSource}
                dataSourceSettings={settings[dataSource.settingsKey]}
                onSettingsChange={handleSettingsChange}
            />
        </div>
    )

}
