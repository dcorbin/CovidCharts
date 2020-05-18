import React from "react";
import PropTypes from 'prop-types'
import SelectionIndicator from "./selection_indicator";

export default function SelectableValue(props) {
    let outerSpanClassNames = ['indicator', 'selectable'];
    let innerSpanClassNames = []
    if (props.selected) {
        outerSpanClassNames.push('selected')
        innerSpanClassNames.push('selected')
    }
    return <span className={outerSpanClassNames.join(' ')}>
                                    <SelectionIndicator/>
        &nbsp;<span className={innerSpanClassNames.join(' ')}>
                                   {props.valueRenderer(props.value)}</span></span>
}

SelectableValue.propTypes = {
    selected: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
    valueRenderer: PropTypes.func.isRequired,
}
