import React from "react";
import PropTypes from 'prop-types'

export default function Footer(props) {
    return <div>
        <div>
            <hr/>
            Data sourced from {props.source} &nbsp;&nbsp;
            Report graphing issues at https://github.com/dcorbin/CovidCharts/issues
        </div>
        <p>
            Software updates and system maintenance generally happen between 6-8 AM (ET). They are not regular, but
            happen when
            a reasonable improvement is available. If you have problems with the site during this time, please be
            patient and
            try again later.
        </p>
    </div>
}

Footer.propTypes = {
    source: PropTypes.any.isRequired
}