import {compare_records_by_date} from "../util/date_comparison";
import Aggregator from "../covid_tracking_com/aggregator";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import MultiLineChart from "./multi_line_chart";
import React from "react";
import PropTypes from 'prop-types'


export default function SevenDayAverageChart(props) {
    let selectedStates = props.selectedStates
    if (selectedStates.length === 0) {
        return <h3>No States Selected</h3>
    }

    let rawDataPropertyNames = props.rawDataPropertyNames.filter(name =>
        selectedStates.every(state => props.covidTrackingData.dataSeriesByState[state].includes(name))
    )

    let dataToChart = props.covidTrackingData.records.filter(r =>  selectedStates.includes(r.state)).
    sort(compare_records_by_date)
    dataToChart = new Aggregator(rawDataPropertyNames).aggregate(dataToChart)
    dataToChart = new DeltaDecorator().decorate(dataToChart)
    dataToChart = new SevenDayAverageDecorator().decorate(dataToChart)
    return <MultiLineChart records={dataToChart} subject={props.subject}/>
}

SevenDayAverageChart.propTypes = {
    rawDataPropertyNames: PropTypes.array.isRequired,
    selectedStates: PropTypes.array.isRequired,
    covidTrackingData: PropTypes.object.isRequired,
    subject: PropTypes.string.isRequired
}

