import React from "react";
import {StateTable} from "../states";
import AbstractCovidTrackingChartPanel from "./abstract_covid_tracking_chart_panel";
import MultiRegionPickList from "./multi_state_pick_list";

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

    render() {
        return <div>
            <div>
                {/*<StatePickList initialState={this.state.selectedStates[0]} onSelectionChange={this.stateSelectionChanged}/>*/}
                <MultiRegionPickList initialRegions={this.state.selectedStates} all={new StateTable().all()}
                                     onSelectionChange={this.stateSelectionChanged}/>

            </div>
            <div>
                {this.chartContents()}
            </div>
        </div>
    }
}

