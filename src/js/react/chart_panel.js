import React, {useEffect, useState} from "react";
import DataLine from "../charting/data_line";
import NormalizedRecordSet from "../covid_tracking_com/normalized_record_set";
import PropTypes from 'prop-types'
import './chartPanel.css'
import DataPreparer from "../model/data_preparer";
import MultiLineChart from "./multi_line_chart";
import ControlPanel from "./control_panel";

export const LINES = [
    new DataLine('New Positives', 'left', 'blue', 'positive', r => {
        return r.seven_day_averages.new_positives
    }),
    new DataLine('New Hospitalizations', 'right', '#cc9900', 'hospitalized', r => {
        return r.seven_day_averages.new_hospitalizations
    }),
    new DataLine('New Deaths', 'right', 'red', 'death', r => {
        return r.seven_day_averages.new_deaths
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

ChartPanel.propTypes = {
    recordSet: PropTypes.object.isRequired,
    settings: PropTypes.shape({
        nullStrategy: PropTypes.string.isRequired,
        selectedRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
        userQuickPicks: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            regions: PropTypes.arrayOf(PropTypes.string),
            regionsFilter: PropTypes.func
        })).isRequired
    }).isRequired,
    regionSpec: PropTypes.shape({
            singleNoun: PropTypes.string.isRequired,
            pluralNoun: PropTypes.string.isRequired,
            matrixMapRatio: PropTypes.arrayOf(PropTypes.number).isRequired,
            displayNameFor: PropTypes.func.isRequired,
            mapURI: PropTypes.string.isRequired,
            quickPicks: PropTypes.arrayOf(
                PropTypes.shape(
                    {
                        key: PropTypes.string.isRequired,
                        name: PropTypes.string.isRequired,
                        regions: PropTypes.arrayOf(PropTypes.string),
                        regionsFilter: PropTypes.func
                    }
                )
            ).isRequired
        }
    ),
    onSettingsChange: PropTypes.func
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
        <div>
            <ControlPanel settings={props.settings}
                          onSettingsChange={props.onSettingsChange}
                          regionSpec={props.regionSpec}
                          normalizedRecordSet={normalizedRecordSet}
                          showNullStrategy={normalizedRecordSet.hasWarning('broken')}/>
            <div>
                {(props.settings.selectedRegions.length === 0) ?
                    <h3>No {props.pluralRegion} Selected</h3> :
                    <MultiLineChart records={dataToChart}
                                    subject={createChartSubject(props.settings, formattedRegionList)}
                                    lines={dataLines}
                                    verticalScaleType={props.settings.verticalScaleType}/>}
            </div>
        </div>
        )

}

