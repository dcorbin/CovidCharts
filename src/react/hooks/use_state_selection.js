import {StateTable} from "../../states";
import React, {useState} from "react";
import ArraySummary from "../array_summary";
import ColumnarMatrix from "../columnar_matrix";
import SelectableValue from "../selectable_value";
import useCollapsable from "./use_collapsable";
import StateQuickPick from "../state_quick_pick";

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
            return null
        }
        if (!covidTrackingData.hasValidData(state, 'hospitalized')) {
            return <img alt='No data on hospitalizations' style={{width: 12, height: 12, verticalAlign: 'middle'}}
                        src={'/data/hospitalized.png'}/>
        }
        return null
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
                                                                        &nbsp; {renderDataSeriesWarnings(state)}</span>
                                                                }}
                                                                selected={selected}/>;
                                    }}
                    />
                <StateQuickPick onClick={(states) => {
                    setSelectedStates(states);
                    onSettingsChange(states)
                }}/>
            </div>
            <div className='footer'><img alt='No data on hospitalizations' style={{width: 12, height: 12, verticalAlign: 'middle'}}
                      src={'/data/hospitalized.png'}/> No data for hospitalizations available
            </div>

        </div>;
    }

    let formattedStateList = selectedStates.map(s => stateTable.fullName(s)).join(", ")
    const displayContent = useCollapsable(stateSelectionPanel, collapsedStateSelectionPanel, 'StateSelection')
    return [displayContent, selectedStates, formattedStateList]
}
