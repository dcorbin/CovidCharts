import {StateTable} from "../../states";
import React, {useState} from "react";
import ArraySummary from "../array_summary";
import ColumnarMatrix from "../columnar_matrix";
import SelectableValue from "../selectable_value";
import useCollapsable from "./use_collapsable";
import StateQuickPick from "../state_quick_pick";
import {COVID_TRACKING_PROPERTIES, propertyDisplay} from "../../covid_tracking_com/covid_tracking_com";
import DataIcon from "../data_icon";

export default function useStateSelection(initialSelections, selectionStrategy, covidTrackingData, onSettingsChange) {
    let stateTable = new StateTable();

    const [selectedStates, setSelectedStates] = useState(initialSelections)

    function matrixItemClicked(clickedValue) {
        let newSelections = selectionStrategy(clickedValue, [...selectedStates]);
        setSelectedStates(newSelections)
        onSettingsChange(newSelections)
    }

    function renderDataSeriesWarnings(state) {
        if (covidTrackingData === null) {
            return []
        }
        let warningIcons = []
        let hasHospitalizationData = covidTrackingData.hasValidData(state, 'hospitalized');
        if (!hasHospitalizationData) {
            warningIcons.push(<DataIcon label='No data on hospitalizations'
                        url={'/data/hospitalized.png'}/>)
        }
        let brokenProperties = []
        COVID_TRACKING_PROPERTIES.forEach(propertyName => {
        if (!covidTrackingData.isContinuous(state, propertyName)) {
            if (hasHospitalizationData || propertyName !== 'hospitalized')
                brokenProperties.push(propertyDisplay(propertyName))
        }})
        if (brokenProperties.length > 0) {
            warningIcons.push(<DataIcon label={'Missing data: ' + brokenProperties.join(', ')}
                                        url='/data/broken.svg'/>)
        }
        return warningIcons
    }

    function collapsedStateSelectionPanel() {
        return <ArraySummary singleNoun='state'
                             pluralNoun='states'
                             values={selectedStates.map(s => stateTable.fullName(s))}/>
    }

    function stateSelectionPanel() {
        return <div className='StateSelection'>
            <div>
                    <ColumnarMatrix values={stateTable.all_abbreviations()}
                                    columns={6}
                                    onValueClicked={matrixItemClicked}
                                    valueRenderer={value => {
                                        let selected = selectedStates.includes(value)
                                        return <SelectableValue value={value}
                                                                valueRenderer={state => {
                                                                    return <span>{stateTable.fullName(state)}
                                                                        {renderDataSeriesWarnings(state)}</span>
                                                                }}
                                                                selected={selected}/>;
                                    }}
                    />
                <StateQuickPick onClick={(states) => {
                    setSelectedStates(states);
                    onSettingsChange(states)
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

    let formattedStateList = selectedStates.map(s => stateTable.fullName(s)).join(", ")
    const displayContent = useCollapsable(stateSelectionPanel, collapsedStateSelectionPanel, 'StateSelection')
    return [displayContent, selectedStates, formattedStateList]
}
