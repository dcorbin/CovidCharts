import React from "react";
import PropTypes from 'prop-types'
import './selectableValue.css'
import Circle from "./basic/circle/circle";
export default function SelectableValue(props) {
    let outerSpanClassNames = ['SelectableValue'];
    if (props.selected) {
        outerSpanClassNames.push('selected')
    }

    if (props.hover) {
        outerSpanClassNames.push('hover')
    }

    return <span key={props.value} className={outerSpanClassNames.join(' ')}>
        <Circle className='indicator' size={8}/><span>{props.valueRenderer(props.value)}</span></span>
}

SelectableValue.propTypes = {
    selected: PropTypes.bool.isRequired,
    hover: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
    valueRenderer: PropTypes.func.isRequired,
}
