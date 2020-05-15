import React from "react";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import SevenDayAverageDecorator from "../covid_tracking_com/seven_day_avg_decorator";
import {compare_records_by_date} from "../util/date_comparison";
import MultiLineChart from './multi_line_chart'
import Aggregator from "../covid_tracking_com/aggregator";

export default class AbstractCovidTrackingChartPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:null,
            dateSeriesByState: {},
            subject: "TBD",
            subsetFilter: ()=>true
        }
    }


    componentDidMount() {
        this.props.dataProvider.getData().then(d => {
                this.setState({data: d, dateSeriesByState: this.dataSeriesByState(d)})
            }
        )
    }

    rawDataPropertyNames() {
       return ['positive', 'death', 'hospitalized'];
    }

    chartContents() {
        if (this.state.data == null) {
            return "Waiting for data fetch to complete..."
        }
        if (this.state.selectedStates.length === 0) {
            return <h3>{this.state.subject}</h3>
        }

        let dataToChart = this.state.data.filter(this.state.subsetFilter).
                                          sort(compare_records_by_date)
        dataToChart = new  Aggregator(this.rawDataPropertyNames()).aggregate(dataToChart)
        dataToChart = new DeltaDecorator().decorate(dataToChart)
        dataToChart = new SevenDayAverageDecorator().decorate(dataToChart)
        return <MultiLineChart records={dataToChart} subject={this.state.subject}/>
    }
}



