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
    const [nullStrategy, setNullStrategy] = useState(props.settings.nullStrategy)
    function nullStrategyChanged(e) {
        e.preventDefault();
        let newValue = e.currentTarget.options[e.currentTarget.selectedIndex].value;
        setNullStrategy(newValue)
        props.settings.nullStrategy = newValue
        props.onSettingsChange(props.settings)
    }

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
                <div className='ControlPanel'>
                    {stateSelectionDisplay}
                    <div>
                        <form>
                            <label>Missing Data Strategy:</label>
                            <select onChange={nullStrategyChanged} value={props.settings.nullStrategy}>
                                <option value='none'>Do not plot</option>
                                <option value='leadingNullAsZero'>Tread leading gaps as zeros</option>
                            </select>
                        </form>
                    </div>
                </div>
                <div>
                    <SevenDayAverageChart rawDataPropertyNames={COVID_TRACKING_PROPERTIES}
                                          selectedStates={selectedStates}
                                          covidTrackingData={covidTrackingData}
                                          nullStrategy={nullStrategy}
                                          subject={formattedStateList}/>
                </div>
            </div>

}



