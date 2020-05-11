import React from "react";
import {StateTable} from '../states'

export default class StatePickList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedState: this.props.initialState };

        this.stateSelected = this.stateSelected.bind(this)
    }

    byStateName(a, b) {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
    }

    stateSelected(e) {
        e.preventDefault();
        let newValue = e.currentTarget.options[e.currentTarget.selectedIndex].value;
        this.setState({selectedState: newValue})
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newValue)
        }
    }

    render() {
        let table = new StateTable()
        return <select value={this.state.selectedState} onChange={this.stateSelected}> {
            table.all().sort(this.byStateName).map(state =>
                <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
            )
        } </select>
    }
}
