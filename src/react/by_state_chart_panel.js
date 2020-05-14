import React from "react";
import {StateTable} from "../states";
import AbstractCovidTrackingChartPanel from "./abstract_covid_tracking_chart_panel";
import MultiPickMatrix from "./multi_pick_matix";

export default class ByStateChartPanel extends AbstractCovidTrackingChartPanel {
    constructor(props) {
        super(props);
        let newState = this.stateBasedReactState(this.props.initialStates)
        this.state.selectedStates = newState.selectedStates
        this.state.subject = newState.subject
        this.state.subsetFilter = newState.subsetFilter
        this.stateSelectionChanged = this.stateSelectionChanged.bind(this)
    }

    stateSelectionChanged(newValue) {
        this.setState(this.stateBasedReactState(newValue))
        if (this.props.onSettingsChange) {
            this.props.onSettingsChange({states: newValue})
        }
    }

    stateBasedReactState(selectedStates) {
        let subject = this.calculateSubject(selectedStates)
        return {
            selectedStates: selectedStates,
            subject: subject,
            subsetFilter: r =>  selectedStates.includes(r.state),
        };

    }

    calculateSubject(newValue) {
        return newValue.map(state => new StateTable().fullName(state)).join(", ");
    }

    byName(a, b) {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
    }

    render() {
        let stateTable = new StateTable();
        return <div>
            <div>
                <MultiPickMatrix initialSelections={this.state.selectedStates}
                                 allValues={stateTable.all().map(s => s.abbreviation).sort(this.byName) }
                                 valueRenderer={s => stateTable.fullName(s)}
                                 onSelectionChange={this.stateSelectionChanged}/>

            </div>
            <div>
                {this.chartContents()}
            </div>
        </div>
    }
}

