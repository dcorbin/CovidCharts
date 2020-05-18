import React, {useEffect, useState} from "react";
import {StateTable} from "../states";
import MultiPickMatrix from "./multi_pick_matix";
import {COVID_TRACKING_PROPERTIES} from "../covid_tracking_com/covid_tracking_com";
import CovidTrackingData from "../covid_tracking_com/covid_tracking_data";
import ArraySummary from "./array_summary";
import SevenDayAverageChart from "./sevem _day_average_chart";

export default function CovidTrackingChartPanel(props) {
    const [data, setData] = useState(null)
    const [selectedStates, setSelectedStates] = useState(props.initialStates)
    let stateTable = new StateTable();

    useEffect(() => {
        props.dataProvider.getData().then(d => {
                setData(new CovidTrackingData(d))
            }
        )
    },[])

    function stateSelectionChanged(newValue) {
        setSelectedStates(newValue)
        if (props.onSettingsChange) {
            props.onSettingsChange({states: newValue})
        }
    }

    function renderDataSeriesWarnings(state) {
        if (data == null) {
            return null
        }
        let series = data.dataSeriesByState[state]
        if (series == null)
            return null
        if (!series.includes('hospitalized')) {
            return <img alt='No data on hospitalizations' style={{width: 12, height:12, verticalAlign: 'middle'}}
                               src={'/data/hospitalized.png'}/>
        }
        return null
    }

    function formatSubject() {
        let states = selectedStates
        if (states.length === 0) {
            return "No States selected."
        }

        return states.map(state => new StateTable().fullName(state)).join(", ");
    }

    if (data == null) {
        return "Waiting for covidTrackingData fetch to complete..."
    }

    return <div>
        <div>
            <MultiPickMatrix initialSelections={selectedStates}
                             allValues={stateTable.all_abbreviations() }
                             columns={6}
                             summaryRenderer={() => <ArraySummary singleNoun='state'
                                                            pluralNoun='states'
                                                            values={selectedStates.map(s=>stateTable.fullName(s))}/>}
                             valueRenderer={state => {
                                 return <span>{stateTable.fullName(state)}
                                     &nbsp; {renderDataSeriesWarnings(state)}</span>
                             }}
                             onSelectionChange={stateSelectionChanged}/>
            <div><img alt='No data on hospitalizations' style={{width: 12, height:12, verticalAlign: 'middle'}}
                      src={'/data/hospitalized.png'}/> No data for hospitalizations available</div>

        </div>
        <div>
            <SevenDayAverageChart rawDataPropertyNames={COVID_TRACKING_PROPERTIES}
                      selectedStates={selectedStates}
                      covidTrackingData= {data}
                      subject={formatSubject()}/>
        </div>
    </div>
}



