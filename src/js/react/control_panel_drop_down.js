import LabeledCombo from "./basic/labeled_combo";
import PropTypes from "prop-types";
import React from "react";

export default function ControlPanelDropDown(props) {
    function handleChange() {
        return (newValue) => {
            props.settings[props.propertyName] = newValue
            props.onSettingsChange(props.settings)
        }
    }
    return (
        <span>
            <LabeledCombo label={props.label}
                          initialValue={props.settings[props.propertyName]}
                          onChange={handleChange()}
                          options={props.options} />
           <span className='Spacer'> </span>

        </span>
    )

}
ControlPanelDropDown.defaultProps = {
    newValueParser: (value) => value
}

ControlPanelDropDown.propTypes = {
    label: PropTypes.string.isRequired,
    options: LabeledCombo.propTypes.options,
    settings: PropTypes.object.isRequired,
    propertyName: PropTypes.string.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    newValueParser: PropTypes.func
}
