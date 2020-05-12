import React from "react";
import StatePickList from "./state_pick_list";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import {compare_records_by_date} from "../util/date_comparison";
import {StateTable} from "../states";
import MultiLineChart from './multi_line_chart'

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

    componentDidMount() {
        this.props.dataProvider.getData().then(d => {
                console.log("Data Provided: " + JSON.stringify(d))
                this.setState({data: d})
            }
        )
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

    chartContents() {
        if (this.state.data == null) {
            return "Waiting for data fetch to complete..."
        }

        let stateData = this.state.data.filter(r => r.state === this.state.selectedState).sort(compare_records_by_date)
        stateData = new DeltaDecorator().decorate(stateData)
        stateData = new SevenDayAverageDecorator().decorate(stateData)
        return <MultiLineChart records={stateData} subject={new StateTable().fullName(this.state.selectedState)}/>
    }
}

