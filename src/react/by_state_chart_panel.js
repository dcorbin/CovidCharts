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

    dataSeriesByState(records) {
        function dataSeriesAvailable(records, rawDataPropertyNames, state) {
            return  rawDataPropertyNames.map(propertyName => {
                let hasValidData = records.filter(r => r.state === state).map(r => r[propertyName]).some(v => {
                        return !(v === null || typeof v === 'undefined');
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
        if (series == null || typeof series === 'undefined')
            return null
        if (!series.includes('hospitalized')) {
            return <img alt='No data on hospitalizations' style={{width: 12, height:12, verticalAlign: 'middle'}}
                               src={'/data/hospitalized.png'}/>
        }
        return null
    }

    render() {
        let stateTable = new StateTable();
        return <div>
            <div>
                <MultiPickMatrix initialSelections={this.state.selectedStates}
                                 allValues={stateTable.all().map(s => s.abbreviation).sort(this.byName) }
                                 columns={6}
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

