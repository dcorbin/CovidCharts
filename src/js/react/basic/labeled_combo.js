import React from "react";
import PropTypes from 'prop-types'

export default function LabeledCombo(props) {
    function renderLabel() {
        if (!props.label)
            return null
        return <label>{props.label}: </label>
    }

    function handleOnChange() {
        return (e) => {
            e.preventDefault()
            if (props.onChange)
                props.onChange(e.currentTarget.options[e.currentTarget.selectedIndex].value)
        };
    }

    return (
        <span>
            {renderLabel()}
            <select onChange={handleOnChange()} value={props.initialValue}>
                {
                    props.options.map(o => <option value={o.value} key={o.value}>{o.text}</option>)
                }
            </select>
        </span>
    )
}

LabeledCombo.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    initialValue: PropTypes.any,
    options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        }
    )).isRequired
}