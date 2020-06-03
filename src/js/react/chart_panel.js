import React, {useEffect, useState} from "react";
import SevenDayAverageChart from "./seven _day_average_chart";
import useRegionSelection from "./hooks/use_region_selection";
import DataLine from "../charting/data_line";
import NormalizedRecordSet from "../covid_tracking_com/normalized_record_set";
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
        useRegionSelection(props.initialSelections,
                                multipleSelections,
                                normalizedRecordSet,
                                props.regionSpec,
                                allRegions,
                                props.columns,
                newRegions => {
                                    props.settings[props.regionSpec.pluralNoun] = newRegions
                                    props.onSettingsChange(props.settings)
                                },
                                )

    if (normalizedRecordSet.error) {
        return normalizedRecordSet.error
    }
    if (normalizedRecordSet.isEmpty()) {
        return "Waiting for data fetch to complete..."
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



