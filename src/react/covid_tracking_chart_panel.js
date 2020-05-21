import React, {useEffect, useState} from "react";
import {COVID_TRACKING_PROPERTIES} from "../covid_tracking_com/covid_tracking_com";
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
    const [covidTrackingData, setCovidTrackingData] = useState(null)

    useEffect(() => {
        props.dataProvider.getData().then(d => {
                setCovidTrackingData(d)
            }
        )
    },[])

    let [stateSelectionDisplay, selectedStates, formattedStateList ] =
        useStateSelection(props.settings.states, multipleSelections,  covidTrackingData, states => {
            props.settings.states = states
            props.onSettingsChange(props.settings)
        })

    if (covidTrackingData == null) {
        return "Waiting for covidTrackingData fetch to complete..."
    }

    return  <div>
                {stateSelectionDisplay}
                <div>
                    <SevenDayAverageChart rawDataPropertyNames={COVID_TRACKING_PROPERTIES}
                                          selectedStates={selectedStates}
                                          covidTrackingData={covidTrackingData}
                                          subject={formattedStateList}/>
                </div>
            </div>

}



