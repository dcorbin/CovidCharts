import React from "react";
import PropTypes from 'prop-types'

export default function Footer(props) {
    return <div>
        <div>
            <hr/>
            Data sourced from {props.source}.  Population data from
            <span> <a href='https://worldpopulationreview.com'>https://worldpopulationreview.com</a></span>.
            <span> Report graphing issues at https://github.com/dcorbin/CovidCharts/issues</span>
        </div>
    </div>
}

Footer.propTypes = {
    source: PropTypes.any.isRequired
}