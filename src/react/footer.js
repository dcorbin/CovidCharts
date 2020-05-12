import React from "react";

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>
                   <hr/>
                   Data sourced from <a href="https://covidtracking.com">covidtracking.com</a>.
                   Report graphing issues at https://github.com/dcorbin/CovidCharts/issues
               </div>
    }
}