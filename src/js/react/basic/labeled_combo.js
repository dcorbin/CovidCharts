import React from "react";
import PropTypes from 'prop-types'
import Select from 'react-select';
import './labeled_combo.css'

export default function LabeledCombo(props) {
    function renderLabel() {
        if (!props.label)
            return null
        return <label>{props.label}: </label>
    }

    function handleChange(value, {action, removedValue}) {
        if (action === 'select-option') {
            if (props.onChange) {
                props.onChange(value.value)
                return
            }
        }
         console.log(`CHANGE: ${action} ${JSON.stringify(value)}`);
    }

    let longestLabelLength = Math.max(...props.options.map(o => o.label.length));
    let pixelsPerCharacter = 8
    return (
        <div  className="LabeledCombo">
            <span className="LabeledCombo-container">
            {renderLabel()}<Select
                    className='react-select'
                    classNamePrefix='react-select'
                    styles={{
                        valueContainer: (provided, state) => {
                            return { ...provided, width: `${longestLabelLength * pixelsPerCharacter}}px`}
                        },
                    }}
                    options={props.options}
                    onChange={handleChange}
                    value={props.options.find(o => o.value === props.initialValue)}
                    backspaceRemovesValue={false}
                    getOptionLabel={
                        (arg) => {
                            return arg.label
                        }
                    }
                    getOptionValue={
                        (arg) => {
                            return String(arg.value)
                        }
                    }
                    isMulti={false}
                    isCreatable={false}
                    isSearchable={false}/>
            </span>
        </div>
    )

}

LabeledCombo.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    initialValue: PropTypes.any,
    options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired
        }
    )).isRequired
}