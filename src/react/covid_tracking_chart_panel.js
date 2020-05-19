import React, {useEffect, useState} from "react";
import {COVID_TRACKING_PROPERTIES} from "../covid_tracking_com/covid_tracking_com";
import CovidTrackingData from "../covid_tracking_com/covid_tracking_data";
import SevenDayAverageChart from "./seven _day_average_chart";
import useStateSelection from "./hooks/use_state_selection";

function multipleSelections(clickedValue, selections) {
    if (selections.some(p => p === clickedValue)) {
        selections.splice (selections.indexOf(clickedValue), 1);
    } else {
        selections.push(clickedValue)
    }
    return selections
}

export default function CovidTrackingChartPanel(props) {
    const [data, setData] = useState(null)

    useEffect(() => {
        props.dataProvider.getData().then(d => {
                setData(new CovidTrackingData(d))
            }
        )
    },[])

    let dataSeriesByState = data == null ? null : data.dataSeriesByState;
    let [stateSelectionDisplay, selectedStates, formattedStateList ] =
        useStateSelection(props.settings.states, multipleSelections,  dataSeriesByState, states => {
            props.settings.states = states
            props.onSettingsChange(props.settings)
        })

    if (data == null) {
        return "Waiting for covidTrackingData fetch to complete..."
    }

    return  <div>
                {stateSelectionDisplay}
                <div>
                    <SevenDayAverageChart rawDataPropertyNames={COVID_TRACKING_PROPERTIES}
                                          selectedStates={selectedStates}
                                          covidTrackingData={data}
                                          subject={formattedStateList}/>
                </div>
            </div>

}



