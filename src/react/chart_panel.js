import React, {useEffect, useState} from "react";
import SevenDayAverageChart from "./seven _day_average_chart";
import useRegionSelection from "./hooks/use_region_selection";
import {StateRegionSpec} from "../states";
import DataLine from "../charting/data_line";
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

export default function CovidTrackingChartPanel(props) {
    let regionSpec = new StateRegionSpec();
    const [normalizedRecordSet, setNormalizedRecordSet] = useState(null)
    const [nullStrategy, setNullStrategy] = useState(props.settings.nullStrategy)
    const [allRegions, setRegions] = useState([])
    function nullStrategyChanged(e) {
        e.preventDefault();
        let newStrategy = e.currentTarget.options[e.currentTarget.selectedIndex].value;
        setNullStrategy(newStrategy)
        props.settings.nullStrategy = newStrategy
        props.onSettingsChange(props.settings)
    }

    function renderNullStrategyControl() {
        if (normalizedRecordSet.hasWarning('broken')) {
            return <div>
                <form>
                    <label>Missing Data Strategy:</label>
                    <select onChange={nullStrategyChanged} value={props.settings.nullStrategy}>
                        <option value='none'>Do not plot</option>
                        <option value='leadingNullAsZero'>Tread leading gaps as zeros</option>
                    </select>
                </form>
            </div>;
        }
    }

    useEffect(() => {
        props.dataProvider.getData().then(recordSet => {
                setNormalizedRecordSet(recordSet)
                setRegions(recordSet.regions)
            }
        )
    },[])
    let [regionSelectionDisplay, selectedRegions, formattedRegionList ] =
        useRegionSelection(props.settings.states,
                                multipleSelections,
                                normalizedRecordSet,
                                regionSpec,
                                allRegions,
                newRegions => {
                                    props.settings.states = newRegions
                                    props.onSettingsChange(props.settings)
                                },
                                )

    if (normalizedRecordSet == null) {
        return "Waiting for normalizedRecordSet fetch to complete..."
    }

    return  <div>
        <div className='ControlPanel'>
            {regionSelectionDisplay}
            {renderNullStrategyControl()}
        </div>
        <div>
            <SevenDayAverageChart
                lines={LINES}
                selectedRegions={selectedRegions}
                normalizedRecordSet={normalizedRecordSet}
                nullStrategy={nullStrategy}
                pluralRegion={props.regionSpec.pluralNoun}
                subject={formattedRegionList}

            />
        </div>
    </div>

}



