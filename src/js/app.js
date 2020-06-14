import DATA_SOURCES, {dataSourceFromKey} from "./react/model/data_source";
import LabeledCombo from "./react/basic/labeled_combo";
import React, {useEffect} from "react";
import ChartPanel from "./react/chart_panel";
import Footer from "./react/footer";
import PropTypes from 'prop-types'
import NormalizedRecordSet from "./covid_tracking_com/normalized_record_set";

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

    useEffect(fetchData,[dataSource])


    function createSettingsChangeHandler(panel) {
        return newTabSettings => {
            let newTotalSettings = Object.assign({}, settings)
            newTotalSettings[panel] = newTabSettings
            setSettings(newTotalSettings)
            props.saveSettings(newTotalSettings)
        };
    }

    function renderBody() {
        if (dataSource)
            return <div className='body'>
                <ChartPanel
                            recordSet={normalizedRecordSet}
                            dataProvider={dataSource.dataProvider}
                            regionSpec={dataSource.regionSpec}
                            settings={settings[dataSource.settingsKey]}
                            onSettingsChange={createSettingsChangeHandler(dataSource.settingsKey)}/>
                <Footer source={<a href={dataSource.footerLink}>{dataSource.footerText}</a>}/>
            </div>;
        return <p>Please select a dataSource.</p>
    }

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
                                      return {value: s.key, text: s.name}
                                  })}
                    />
                </div>
            </div>
            {renderBody()}
        </div>
    )
}
