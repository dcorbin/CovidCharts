import React, {useEffect, useState} from "react";
import {StateTable} from "../states";
import MultiPickMatrix from "./multi_pick_matix";
import {compare_records_by_date} from "../util/date_comparison";
import Aggregator from "../covid_tracking_com/aggregator";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import MultiLineChart from "./multi_line_chart";
import {COVID_TRACKING_PROPERTIES} from "../covid_tracking_com/covid_tracking_com";
import CovidTrackingData from "../covid_tracking_com/covid_tracking_data";
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

    function formatSubject() {
        let states = selectedStates
        if (states.length === 0) {
            return "No States selected."
        }

        return states.map(state => new StateTable().fullName(state)).join(", ");
    }

    function byName(a, b) {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
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

    function chartContents(rawDataPropertyNames) {
        if (selectedStates.length === 0) {
            return <h3>No States Selected</h3>
        }
        rawDataPropertyNames = COVID_TRACKING_PROPERTIES.filter(name =>
            selectedStates.every(state => data.dataSeriesByState[state].includes(name))
        )

        let dataToChart = data.records.filter( r =>  selectedStates.includes(r.state)).
            sort(compare_records_by_date)
        dataToChart = new  Aggregator(rawDataPropertyNames).aggregate(dataToChart)
        dataToChart = new DeltaDecorator().decorate(dataToChart)
        dataToChart = new SevenDayAverageDecorator().decorate(dataToChart)
        return <MultiLineChart records={dataToChart} subject={formatSubject()}/>
    }


    if (data == null) {
        return "Waiting for data fetch to complete..."
    }


    return <div>
        <div>
            <MultiPickMatrix initialSelections={selectedStates}
                             allValues={stateTable.all().map(s => s.abbreviation).sort(byName) }
                             columns={6}
                             summaryRenderer={selections => {
                                 if (selections.length === 0) {
                                     return "No states selected."
                                 }
                                 if (selections.length === 1) {
                                     return "1 state selected: " + stateTable.fullName(selections[0])
                                 }
                                 return "" + selections.length + " states selected: " +
                                     selections.slice(0, 7).map(s => stateTable.fullName(s)).join(', ') +
                                     ( selections.length > 7 ? ', ...' : '')
                             }}
                             valueRenderer={state => {
                                 return <span>{stateTable.fullName(state)}
                                     &nbsp; {renderDataSeriesWarnings(state)}</span>
                             }}
                             onSelectionChange={stateSelectionChanged}
                             footer={<div><img alt='No data on hospitalizations' style={{width: 12, height:12, verticalAlign: 'middle'}}
                                                  src={'/data/hospitalized.png'}/> No data for hospitalizations available</div>}/>

        </div>
        <div>
            {chartContents(COVID_TRACKING_PROPERTIES)}
        </div>
    </div>
}

