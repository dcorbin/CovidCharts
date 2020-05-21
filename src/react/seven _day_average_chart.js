import {compare_records_by_date} from "../util/date_comparison";
import Aggregator from "../covid_tracking_com/aggregator";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import MultiLineChart from "./multi_line_chart";
import React from "react";
import PropTypes from 'prop-types'
import dataDebugLog from "../covid_tracking_com/debug_data_log";
import LeadingNullAsZeroConverter from "../covid_tracking_com/leading_null_as_zero_converter";

export default function SevenDayAverageChart(props) {
    let selectedStates = props.selectedStates
    if (selectedStates.length === 0) {
        return <h3>No States Selected</h3>
    }

    let rawDataPropertyNames = props.rawDataPropertyNames.filter(name =>
        selectedStates.every(state => props.covidTrackingData.hasValidData(state,name))
    )

    let dataToChart = props.covidTrackingData.records.filter(r =>  selectedStates.includes(r.state)).
        sort(compare_records_by_date)
    dataDebugLog("Normalized Data for " + selectedStates.join(',')+":\n", dataToChart)
    if (props.nullStrategy === 'leadingNullAsZero') {
        dataToChart = new LeadingNullAsZeroConverter(rawDataPropertyNames).convert(dataToChart)
        dataDebugLog("leadingNullAsZero Data for " + selectedStates.join(',')+":\n", dataToChart)
    }
    dataToChart = new Aggregator(rawDataPropertyNames).aggregate(dataToChart)
    dataDebugLog("Aggregated Data:\n", dataToChart)
    dataToChart = new DeltaDecorator().decorate(dataToChart)
    dataDebugLog("Data with Deltas:\n", dataToChart)
    dataToChart = new SevenDayAverageDecorator().decorate(dataToChart)
    dataDebugLog("Data with 7-day Avg.:\n", dataToChart)
    return <MultiLineChart records={dataToChart} subject={props.subject}/>
}

SevenDayAverageChart.propTypes = {
    rawDataPropertyNames: PropTypes.array.isRequired,
    selectedStates: PropTypes.array.isRequired,
    covidTrackingData: PropTypes.object.isRequired,
    subject: PropTypes.string.isRequired
}

