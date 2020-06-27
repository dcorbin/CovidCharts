import React from "react";
import DataLine from "../charting/data_line";
import PropTypes from 'prop-types'
import './chart_panel.css'
import DataPreparer from "../model/data_preparer";
import MultiLineChart from "./multi_line_chart";
import ControlPanel from "./control_panel";
import PROP_TYPES from "./model/prop_types";

export const LINES = [
    new DataLine('New Positives', 'left', 'blue', 'positive', r => {
        return r.nDayAverages.deltaPositive
    }),
    new DataLine('New Hospitalizations', 'right', '#cc9900', 'hospitalized', r => {
        return r.nDayAverages.deltaHospitalized
    }),
    new DataLine('New Deaths', 'right', 'red', 'death', r => {
        return r.nDayAverages.deltaDeath
    }),
];

function createChartSubject(settings, formattedRegionList) {
    function movingAvgSummaryDescription(movingAvgStrategy) {
        if (movingAvgStrategy === 1) {
            return "Raw data"
        }
        return `${movingAvgStrategy}-day Average`
    }
    return movingAvgSummaryDescription(settings.movingAvgStrategy) + ' for ' + formattedRegionList;
}
ChartPanel.defaultProps = {
    showControlPanel: true,
}
ChartPanel.propTypes = {
    recordSet: PropTypes.object.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
    settings: PROP_TYPES.DataSourceSettings.isRequired,
    onSettingsChange: PropTypes.func,
    showControlPanel: PropTypes.bool
}


export default function ChartPanel(props) {
    const normalizedRecordSet = props.recordSet
    if (normalizedRecordSet.error) {
        return normalizedRecordSet.error
    }

    if (normalizedRecordSet.isEmpty()) {
        return "Waiting for data fetch to complete..."
    }

    let dataLines = props.settings.dataLinesId === 'ALL' ?
        LINES :  LINES.filter(line => props.settings.dataLinesId.includes(line.sourceProperty))

    let dataToChart = DataPreparer.prepareDataToChart(normalizedRecordSet,
        props.settings.selectedRegions,
        dataLines,
        props.settings.movingAvgStrategy,
        props.settings.nullStrategy === 'leadingNullAsZero')

    let formattedRegionList = props.settings.selectedRegions.map(region => props.regionSpec.displayNameFor(region)).join(", ")

    return (
        <div style={{height:'100%', width:'100%'}}>
            {props.showControlPanel ?  <ControlPanel settings={props.settings}
                          onSettingsChange={props.onSettingsChange}
                          regionSpec={props.regionSpec}
                          normalizedRecordSet={normalizedRecordSet}/>: null}
            <div style={{width: '100%', height: '100%'}}>
                {(props.settings.selectedRegions.length === 0) ?
                    <h3>No {props.regionSpec.pluralNoun} selected</h3> :
                    <MultiLineChart records={dataToChart}
                                    subject={createChartSubject(props.settings, formattedRegionList)}
                                    lines={dataLines}
                                    verticalScaleType={props.settings.verticalScaleType}/>}
            </div>
        </div>
        )

}

