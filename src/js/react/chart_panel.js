import React, {useEffect, useState} from "react";
import SevenDayAverageChart from "./seven _day_average_chart";
import useRegionSelection from "./hooks/use_region_selection";
import DataLine from "../charting/data_line";
import NormalizedRecordSet from "../covid_tracking_com/normalized_record_set";
import PropTypes from 'prop-types'

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
                                props.columns,
                newRegions => {
                                    props.settings.selectedRegions = newRegions
                                    props.onSettingsChange(props.settings)
                                },
                                )

    if (normalizedRecordSet.error) {
        return normalizedRecordSet.error
    }
    if (normalizedRecordSet.isEmpty()) {
        return "Waiting for data fetch to complete..."
    }

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

ChartPanel.propTypes = {
    settings: PropTypes.shape({
        nullStrategy: PropTypes.string.isRequired,
        selectedRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
        userQuickPicks: PropTypes.arrayOf({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            regions: PropTypes.arrayOf(PropTypes.string),
            regionsFilter: PropTypes.func
        }).isRequired
    }).isRequired,
    columns: PropTypes.number.isRequired,
    regionSpec: PropTypes.shape({
            singleNoun: PropTypes.string.isRequired,
            pluralNoun: PropTypes.string.isRequired,
            displayNameFor: PropTypes.func.isRequired,
            mapURI: PropTypes.string.isRequired,
            quickPicks: PropTypes.arrayOf(
                PropTypes.shape(
                    {
                        key: PropTypes.string.isRequired,
                        text: PropTypes.string.isRequired,
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
