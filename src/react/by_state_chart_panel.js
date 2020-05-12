import React from "react";
import StatePickList from "./state_pick_list";
import {StateTable} from "../states";
import AbstractCovidTrackingChartPanel from "./abstract_covid_tracking_chart_panel";

export default class ByStateChartPanel extends AbstractCovidTrackingChartPanel {
    constructor(props) {
        super(props);
        let newState = this.stateBasedReactState(this.props.initialState)
        this.state.selectedState = newState.selectedState
        this.state.subject = newState.subject
        this.state.subsetFilter = newState.subsetFilter
        this.stateSelectionChanged = this.stateSelectionChanged.bind(this)
    }

    stateSelectionChanged(newValue) {
        this.setState(this.stateBasedReactState(newValue))
        if (this.props.onSettingsChange) {
            this.props.onSettingsChange({state: newValue})
        }
    }

    stateBasedReactState(newValue) {
        return {
            selectedState: newValue,
            subject: new StateTable().fullName(newValue),
            subsetFilter: r => r.state === this.state.selectedState,
        };
    }

    render() {
        return <div>
            <div>
                <StatePickList initialState={this.state.selectedState} onSelectionChange={this.stateSelectionChanged}/>
            </div>
            <div>
                {this.chartContents()}
            </div>
        </div>
    }
}

