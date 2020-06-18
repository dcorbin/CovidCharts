import PropTypes from "prop-types";
import React from "react";
import './trend_percentage.css'
TrendPercentage.defaultProps = {
    value: null,
    precision: 0
}
TrendPercentage.propTypes = {
    value: PropTypes.number,
    precision: PropTypes.number
}

export default function TrendPercentage(props) {
    if (props.value === Infinity) {
        return <span className='infinity'>{'\u221e'}</span>
    }
    if (Math.abs(props.value) === Infinity) {
        return <span>All Clear</span>
    }
    if (props.value === null || isNaN(props.value)) {
        return <span>N/A</span>
    }
    return String(props.value.toFixed(1)) + '%'

}