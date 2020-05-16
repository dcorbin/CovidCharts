import React from "react";
import {StateTable} from "../states";
import MultiPickMatrix from "./multi_pick_matix";
import {compare_records_by_date} from "../util/date_comparison";
import Aggregator from "../covid_tracking_com/aggregator";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import MultiLineChart from "./multi_line_chart";
import {COVID_TRACKING_PROPERTIES} from "../covid_tracking_com/covid_tracking_com";

export default class ByStateChartPanel extends React.Component {
    constructor(props) {
        super(props);
        let newState = this.stateBasedReactState(this.props.initialStates)
        this.state = {
            data:null,
            dateSeriesByState: {},
            selectedStates: newState.selectedStates,
            subject: newState.subject,
            subsetFilter: newState.subsetFilter
        }

        this.stateSelectionChanged = this.stateSelectionChanged.bind(this)
    }

    componentDidMount() {
        this.props.dataProvider.getData().then(d => {
                this.setState({data: d, dateSeriesByState: this.dataSeriesByState(d)})
            }
        )
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
        }
    }

    dataSeriesByState(records) {
        function dataSeriesAvailable(records, rawDataPropertyNames, state) {
            return  rawDataPropertyNames.map(propertyName => {
                let hasValidData = records.filter(r => r.state === state).map(r => r[propertyName]).some(v => {
                        return !(v === null);
                    }
                )
                if (hasValidData) {
                    return propertyName
                }
                return null
            }).filter(x => x != null)
        }


        let allStates = new StateTable().all_abbreviations();
        return allStates.reduce( (result, state) => {
            result[state] = dataSeriesAvailable(records, this.rawDataPropertyNames(), state)
            return result
        }, {})
    }


    calculateSubject(states) {
        if (states.length === 0) {
            return "No States selected."
        }

        return states.map(state => new StateTable().fullName(state)).join(", ");
    }

    byName(a, b) {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
    }

    renderDataSeriesWarnings(state) {
        let series = this.state.dateSeriesByState[state]
        if (series == null)
            return null
        if (!series.includes('hospitalized')) {
            return <img alt='No data on hospitalizations' style={{width: 12, height:12, verticalAlign: 'middle'}}
                               src={'/data/hospitalized.png'}/>
        }
        return null
    }

    rawDataPropertyNames() {
        return COVID_TRACKING_PROPERTIES
    }

    chartContents(rawDataPropertyNames) {
        if (this.state.data == null) {
            return "Waiting for data fetch to complete..."
        }
        if (this.state.selectedStates.length === 0) {
            return <h3>{this.state.subject}</h3>
        }
        rawDataPropertyNames = rawDataPropertyNames.filter(name =>
            this.state.selectedStates.every(state => this.state.dateSeriesByState[state].includes(name))
        )

        let dataToChart = this.state.data.filter(this.state.subsetFilter).
        sort(compare_records_by_date)
        dataToChart = new  Aggregator(rawDataPropertyNames).aggregate(dataToChart)
        dataToChart = new DeltaDecorator().decorate(dataToChart)
        dataToChart = new SevenDayAverageDecorator().decorate(dataToChart)
        return <MultiLineChart records={dataToChart} subject={this.state.subject}/>
    }

    render() {
        let stateTable = new StateTable();
        return <div>
            <div>
                <MultiPickMatrix initialSelections={this.state.selectedStates}
                                 allValues={stateTable.all().map(s => s.abbreviation).sort(this.byName) }
                                 columns={6}
                                 summaryRenderer={selections => {
                                     if (selections.length === 0) {
                                         return "No states selected."
                                     }
                                     if (selections.length === 1) {
                                         return "1 state selected: " + stateTable.fullName(selections[0])
                                     }
                                     return "" + selections.length + " states selected: " +
                                         selections.slice(0, 7).map(s => stateTable.fullName(s)).join(', ') +
                                         ( selections.length > 7 ? ', ...' : '')
                                 }}
                                 valueRenderer={state => {
                                     let seriesIcons = this.renderDataSeriesWarnings(state)
                                     return <span>{stateTable.fullName(state)}
                                         &nbsp; {seriesIcons}</span>
                                 }}
                                 onSelectionChange={this.stateSelectionChanged}
                                 footer={<div><img alt='No data on hospitalizations' style={{width: 12, height:12, verticalAlign: 'middle'}}
                                                      src={'/data/hospitalized.png'}/> No data for hospitalizations available</div>}/>

            </div>
            <div>
                {this.chartContents(this.rawDataPropertyNames())}
            </div>
        </div>
    }
}

