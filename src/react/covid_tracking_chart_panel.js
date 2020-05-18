import React, {useEffect, useState} from "react";
import {StateTable} from "../states";
import {COVID_TRACKING_PROPERTIES} from "../covid_tracking_com/covid_tracking_com";
import CovidTrackingData from "../covid_tracking_com/covid_tracking_data";
import ArraySummary from "./array_summary";
import SevenDayAverageChart from "./seven _day_average_chart";
import SelectableValue from "./selectable_value";
import ColumnarMatrix from "./columnar_matrix";
import useCollapsable from "./hooks/use_collapsable";

export default function CovidTrackingChartPanel(props) {
    let stateTable = new StateTable();
    const [data, setData] = useState(null)
    const [selectedStates, setSelectedStates] = useState(props.initialStates)

    useEffect(() => {
        props.dataProvider.getData().then(d => {
                setData(new CovidTrackingData(d))
            }
        )
    },[])
    const content = useCollapsable(stateSelectionPanel, collapsedStateSelectionPanel, 'StateSelection')

    function selectionStrategy(clickedValue, selections) {
        if (selections.some(p => p === clickedValue)) {
            selections.splice (selections.indexOf(clickedValue), 1);
        } else {
            selections.push(clickedValue)
        }
        return selections
    }

    function matrixItemClicked(clickedValue) {
        let newSelections = selectionStrategy(clickedValue, [...selectedStates]);
        setSelectedStates(newSelections)
        if (props.onSettingsChange) {
            props.onSettingsChange({states: selectedStates})
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
        if (selectedStates.length === 0) {
            return "No States selected."
        }

        return selectedStates.map(state => new StateTable().fullName(state)).join(", ");
    }

    if (data == null) {
        return "Waiting for covidTrackingData fetch to complete..."
    }

    function collapsedStateSelectionPanel() {
        return <ArraySummary singleNoun='state'
                             pluralNoun='states'
                             values={selectedStates.map(s => stateTable.fullName(s))}/>
    }

    function stateSelectionPanel() {
        return <div>
            <ColumnarMatrix values={stateTable.all_abbreviations()}
                            columns={6}
                            onValueClicked={matrixItemClicked}
                            valueRenderer={value => {
                                let selected = selectedStates.includes(value)
                                return <SelectableValue value={value}
                                                        valueRenderer={state => {
                                                            return <span>{stateTable.fullName(state)}
                                                                &nbsp; {renderDataSeriesWarnings(state)}</span>
                                                        }}
                                                        selected={selected}/>;
                            }}
            />
            <div><img alt='No data on hospitalizations' style={{width: 12, height: 12, verticalAlign: 'middle'}}
                      src={'/data/hospitalized.png'}/> No data for hospitalizations available
            </div>

        </div>;
    }
    return  <div>
                {content}
                <div>
                    <SevenDayAverageChart rawDataPropertyNames={COVID_TRACKING_PROPERTIES}
                                          selectedStates={selectedStates}
                                          covidTrackingData={data}
                                          subject={formatSubject()}/>
                </div>
            </div>

}



