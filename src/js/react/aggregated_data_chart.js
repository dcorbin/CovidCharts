import {compare_records_by_date} from "../util/date_comparison";
import Aggregator from "../covid_tracking_com/aggregator";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import NDayAverageDecorator from "../covid_tracking_com/n_day_avg_decorator";
import MultiLineChart from "./multi_line_chart";
import React from "react";
import PropTypes from 'prop-types'
import dataDebugLog from "../covid_tracking_com/debug_data_log";
import LeadingNullAsZeroConverter from "../covid_tracking_com/leading_null_as_zero_converter";

export default function AggregatedDataChart(props) {
    let selectedRegions = props.selectedRegions
    if (selectedRegions.length === 0) {
        return <h3>No {props.pluralRegion} Selected</h3>
    }

    let rawDataPropertyNames = props.lines.map(l => l.sourceProperty).filter(name =>
        selectedRegions.every(region => props.normalizedRecordSet.hasValidData(region,name))
    )

    let dataToChart = props.normalizedRecordSet.records.filter(r =>  selectedRegions.includes(r.region)).
        sort(compare_records_by_date)
    dataDebugLog("Normalized Data for " + selectedRegions.join(',')+":\n", dataToChart)
    if (props.nullStrategy === 'leadingNullAsZero') {
        dataToChart = new LeadingNullAsZeroConverter(rawDataPropertyNames).convert(dataToChart)
        dataDebugLog("leadingNullAsZero Data for " + selectedRegions.join(',')+":\n", dataToChart)
    }
    dataToChart = new Aggregator(rawDataPropertyNames).aggregate(dataToChart)
    dataDebugLog("Aggregated Data:\n", dataToChart)
    dataToChart = new DeltaDecorator().decorate(dataToChart)
    dataDebugLog("Data with Deltas:\n", dataToChart)
    dataToChart = new NDayAverageDecorator().decorate(dataToChart, props.nDayAverage)
    dataDebugLog("Data with 7-day Avg.:\n", dataToChart)
    return <MultiLineChart records={dataToChart}
                           subject={props.subject}
                           lines = {props.lines}
                           verticalScaleType = {props.verticalScaleType}
    />
}
AggregatedDataChart.defaultProps = {
    nDayAverage: 7
}
AggregatedDataChart.propTypes = {
    nDayAverage: PropTypes.number,
    lines: PropTypes.array.isRequired,
    selectedRegions: PropTypes.array.isRequired,
    normalizedRecordSet: PropTypes.object.isRequired,
    subject: PropTypes.string.isRequired,
    pluralRegion: PropTypes.string.isRequired,
    verticalScaleType: PropTypes.string.isRequired,
}

