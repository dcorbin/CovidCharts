import React from "react";
import StatePickList from "./state_pick_list";
import {chart_state_data} from "../charting";

export default class ChartPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedState: this.props.initialState,
            data: null
        };
        this.stateSelectionChanged = this.stateSelectionChanged.bind(this)
    }

    stateSelectionChanged(newValue) {
        this.setState({selectedState: newValue})
        if (this.props.onSettingsChange) {
            this.props.onSettingsChange({state: newValue})
        }
    }

    render() {
        return <div>
            <div>
                <StatePickList initialState={this.state.selectedState} onSelectionChange={this.stateSelectionChanged}/>
            </div>
            <div>
                {chart_state_data(this.props.dataSource, this.state.selectedState)}
            </div>
        </div>
    }
}
