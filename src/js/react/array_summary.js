import React from "react";
import PropTypes from 'prop-types'

export default function ArraySummary(props) {
    if (props.values.length === 0) {
        return <span>No  {props.pluralNoun} selected. </span>
    }
    if (props.values.length === 1) {
        return <span>1 {props.singleNoun} selected: {props.values[0]}</span>
    }
    return <span>{props.values.length} {props.pluralNoun} selected: {
        props.values.slice(0, props.maximumDisplayCount).join(', ') +
        ( props.values.length > props.maximumDisplayCount ? ', ...' : '')
        }
        </span>
}

ArraySummary.defaultProps = {
    maximumDisplayCount: 7
}

ArraySummary.propTypes = {
    maximumDisplayCount: PropTypes.number,
    values: PropTypes.array.isRequired,
    singleNoun: PropTypes.string.isRequired,
    pluralNoun: PropTypes.string.isRequired,
}

