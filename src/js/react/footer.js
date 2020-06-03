import React from "react";
import PropTypes from 'prop-types'

export default function Footer(props) {
    return <div>
        <div>
            <hr/>
            Data sourced from {props.source} &nbsp;&nbsp;
            Report graphing issues at https://github.com/dcorbin/CovidCharts/issues
        </div>
    </div>
}

Footer.propTypes = {
    source: PropTypes.any.isRequired
}