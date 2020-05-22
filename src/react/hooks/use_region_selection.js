import React, {useState} from "react";
import ArraySummary from "../array_summary";
import ColumnarMatrix from "../columnar_matrix";
import SelectableValue from "../selectable_value";
import useCollapsable from "./use_collapsable";
import RegionQuickPick from "../region_quick_pick";
import {propertyDisplay} from "../../covid_tracking_com/covid_tracking_com";
import DataIcon from "../data_icon";
import {STANDARD_DATA_PROPERTIES} from "../../covid_tracking_com/normalized_record_set";

export default function useRegionSelection(initialSelections,
                                           selectionStrategy,
                                           covidTrackingData,
                                           regionSpec,
                                           allRegions,
                                           onSettingsChange,
                                           ) {

    const [selectedRegions, setSelectedRegions] = useState(initialSelections)

    function matrixItemClicked(clickedValue) {
        let newSelections = selectionStrategy(clickedValue, [...selectedRegions]);
        setSelectedRegions(newSelections)
        onSettingsChange(newSelections)
    }

    function renderDataSeriesWarnings(region) {
        if (covidTrackingData === null) {
            return []
        }
        let warningIcons = []
        let hasHospitalizationData = covidTrackingData.hasValidData(region, 'hospitalized');
        if (!hasHospitalizationData) {
            warningIcons.push(<DataIcon key="no_hosp" label='No data on hospitalizations'
                        url={'/data/hospitalized.png'}/>)
        }
        let brokenProperties = []
        STANDARD_DATA_PROPERTIES.forEach(propertyName => {
            if (!covidTrackingData.isContinuous(region, propertyName)) {
                if (hasHospitalizationData || propertyName !== 'hospitalized')
                    brokenProperties.push(propertyDisplay(propertyName))
            }
        })
        if (brokenProperties.length > 0) {
            warningIcons.push(<DataIcon key={'broken_' +  brokenProperties } label={'Missing data: ' + brokenProperties.join(', ')}
                                        url='/data/broken.svg'/>)
        }
        return warningIcons
    }

    function collapsedRegionSelectionPanel() {
        return <ArraySummary singleNoun={regionSpec.singleNoun}
                             pluralNoun={regionSpec.pluralNoun}
                             values={selectedRegions.map(s => regionSpec.displayNameFor(s))}/>
    }

    function regionSelectionPanel() {
        return <div>
            <div>
                    <ColumnarMatrix values={allRegions}
                                    columns={6}
                                    onValueClicked={matrixItemClicked}
                                    valueRenderer={value => {
                                        let selected = selectedRegions.includes(value)
                                        return <SelectableValue value={value}
                                                                valueRenderer={region => {
                                                                    return <span>{regionSpec.displayNameFor(region)}
                                                                        {renderDataSeriesWarnings(region)}</span>
                                                                }}
                                                                selected={selected}/>;
                                    }}
                    />
                <RegionQuickPick quickPicks={regionSpec.quickPicks}
                                 onClick={(regions) => {
                                    setSelectedRegions(regions)
                                    onSettingsChange(regions)
                                }}/>
            </div>

            <div className='footer'>
                <span><DataIcon url='/data/hospitalized.png'/>No data on hospitalizations.</span>
                <span>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                </span>
                <span> <DataIcon url='/data/broken.svg'/> Some data is missing.</span>
            </div>

        </div>;
    }

    let formattedRegionList = selectedRegions.map(region => regionSpec.displayNameFor(region)).join(", ")
    const displayContent = useCollapsable(regionSelectionPanel, collapsedRegionSelectionPanel, 'RegionSelection')
    return [displayContent, selectedRegions, formattedRegionList]
}
