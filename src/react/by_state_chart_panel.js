import React from "react";
import StatePickList from "./state_pick_list";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import {compare_records_by_date} from "../util/date_comparison";
import {StateTable} from "../states";
import MultiLineChart from './multi_line_chart'

class CovidTrackingChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:null,
            subject: "TBD",
            subsetFilter: r=>true
        }
    }

    componentDidMount() {
        this.props.dataProvider.getData().then(d => {
                console.log("Data Provided: " + JSON.stringify(d))
                this.setState({data: d})
            }
        )
    }
    chartContents() {
        if (this.state.data == null) {
            return "Waiting for data fetch to complete..."
        }

        let dataToChart = this.state.data.filter(this.state.subsetFilter).sort(compare_records_by_date)
        dataToChart = new DeltaDecorator().decorate(dataToChart)
        dataToChart = new SevenDayAverageDecorator().decorate(dataToChart)
        return <MultiLineChart records={dataToChart} subject={this.state.subject}/>
    }
}

export default class ByStateChartPanel extends CovidTrackingChart {
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

