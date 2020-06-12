import React, {useEffect, useState} from "react";
import AggregatedDataChart from "./aggregated_data_chart";
import useRegionSelection from "./hooks/region_selection/use_region_selection";
import DataLine from "../charting/data_line";
import NormalizedRecordSet from "../covid_tracking_com/normalized_record_set";
import PropTypes from 'prop-types'
import './chartPanel.css'
import LabeledCombo from "./labeled_combo";

const LINES = [
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

function multipleSelections(clickedValue, selections) {
    if (selections.some(p => p === clickedValue)) {
        selections.splice (selections.indexOf(clickedValue), 1);
    } else {
        selections.push(clickedValue)
    }
    return selections
}


export default function ChartPanel(props) {
    const [normalizedRecordSet, setNormalizedRecordSet] = useState(NormalizedRecordSet.empty)
    const [nullStrategy, setNullStrategy] = useState(props.settings.nullStrategy)
    const [movingAvgStrategy, setMovingAvgStrategy] = useState(props.settings.movingAvgStrategy)
    const [verticalScaleType, setVerticalScaleType] = useState(props.settings.verticalScaleType)
    const [allRegions, setRegions] = useState([])
    const [dataLinesId, setDataLinesId] = useState(props.settings.dataLinesId)

    useEffect(() => {
        props.dataProvider.getData().then(recordSet => {
                setNormalizedRecordSet(recordSet)
                setRegions(recordSet.regions)
            }
        )
    },[])
    let [regionSelectionDisplay, selectedRegions, formattedRegionList ] =
        useRegionSelection(props.settings.selectedRegions,
                                multipleSelections,
                                normalizedRecordSet,
                                props.regionSpec,
                                allRegions,
                                props.settings.userQuickPicks,
                newRegions => {
                                    props.settings.selectedRegions = newRegions
                                    props.onSettingsChange(props.settings)
                                },
                                updateQuickPicks
                                )

    if (normalizedRecordSet.error) {
        return normalizedRecordSet.error
    }
    if (normalizedRecordSet.isEmpty()) {
        return "Waiting for data fetch to complete..."
    }

    function dataLinesChanged(newStrategy) {
        setDataLinesId(newStrategy)
        props.settings.dataLinesId = newStrategy
        props.onSettingsChange(props.settings)
    }
    function nullStrategyChanged(newStrategy) {
        setNullStrategy(newStrategy)
        props.settings.nullStrategy = newStrategy
        props.onSettingsChange(props.settings)
    }

    function movingAvgStrategyChanged(newStrategy) {
        newStrategy = Number.parseInt(newStrategy);
        setMovingAvgStrategy(newStrategy)
        props.settings.movingAvgStrategy = newStrategy
        props.onSettingsChange(props.settings)
    }

    function verticalScaleTypeChanged(newScaleType) {
        setVerticalScaleType(newScaleType)
        props.settings.verticalScaleType = newScaleType
        props.onSettingsChange(props.settings)
    }

    function updateQuickPicks(newQuickPicks) {
        props.settings.userQuickPicks = newQuickPicks
        props.onSettingsChange(props.settings)
    }


    function renderNullStrategyControl() {
        if (normalizedRecordSet.hasWarning('broken')) {
            return <LabeledCombo label ='Missing Data Handling'
                        initialValue={props.settings.nullStrategy}
                        onChange={nullStrategyChanged}
                        options={[
                            {value: 'none', text: 'Do not plot'},
                            {value: 'leadingNullAsZero', text: 'Treat leading gaps as zeros'}
                        ]}
            />
        }
    }

    function renderMovingAverageStrategy() {
        return (
            <LabeledCombo label='Moving Average' initialValue={movingAvgStrategy} onChange={movingAvgStrategyChanged}
                          options={[
                              {value: '1', text: 'None'},
                              {value: '3', text: '3-days'},
                              {value: '7', text: '7-days'},
                              {value: '14', text: '14-days'},
                         ]} />
                )
    }
    function renderVerticalScaleType() {
        return (
            <LabeledCombo label='Vertical Scale Type'
                          initialValue={verticalScaleType}
                          onChange={verticalScaleTypeChanged}
                          options={[
                              {value: 'linear', text: 'Linear'},
                              {value: 'log', text: 'Logarithmic'},
                         ]} />
                )
    }

    function renderDataLineOptions() {
        let options = [
            {value: 'ALL', text: 'All Lines'},
        ].concat(LINES.map(l => {return {value: l.sourceProperty, text: `Only ${l.label}` }}))
        return (
            <LabeledCombo options={options} label='Data Sets' initialValue={dataLinesId} onChange={dataLinesChanged}/>
        )
    }

    function movingAvgSummaryDescription() {
        if (movingAvgStrategy === 1) {
            return "(Raw data)"
        }
        return `(${movingAvgStrategy}-day Average)`
    }

    let lines = dataLinesId === 'ALL' ? LINES :  LINES.filter(line => dataLinesId.includes(line.sourceProperty))

    return  <div>
        <div className='ControlPanel'>
            <form>
                {renderMovingAverageStrategy()}
                <span className='Spacer'> </span>
                {renderDataLineOptions()}
                <span className='Spacer'> </span>
                {renderNullStrategyControl()}
                <span className='Spacer'> </span>
                {renderVerticalScaleType()}
            </form>
            {regionSelectionDisplay}
        </div>
        <div>
            <AggregatedDataChart
                lines={lines}
                selectedRegions={selectedRegions}
                normalizedRecordSet={normalizedRecordSet}
                nullStrategy={nullStrategy}
                pluralRegion={props.regionSpec.pluralNoun}
                subject={movingAvgSummaryDescription() + ' ' + formattedRegionList }
                nDayAverage={movingAvgStrategy}
                verticalScaleType={verticalScaleType}
            />
        </div>
    </div>

}

ChartPanel.propTypes = {
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
            columns: PropTypes.number.isRequired,
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
    dataProvider: PropTypes.shape({
        getData: PropTypes.func.isRequired
    }).isRequired,
    onSettingsChange: PropTypes.func
}
