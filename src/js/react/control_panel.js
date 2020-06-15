import ControlPanelDropDown from "./control_panel_drop_down";
import PropTypes from "prop-types";
import React from "react";
import {LINES} from "./chart_panel";
import RegionSelector from "./region_selector";

export default function ControlPanel(props) {
    function createSettingsChangeHandler(property) {
        return (newValue) => {
            props.settings[property] = newValue
            props.onSettingsChange(props.settings)
        }
    }

    return(
        <div className='ControlPanel'>
            <form>
                <ControlPanelDropDown label='Moving Average'
                                      settings={props.settings}
                                      onSettingsChange={props.onSettingsChange}
                                      propertyName='movingAvgStrategy'
                                      // newValueParser={Number.parseInt}
                                      options={[
                                          {value: 1, label: 'None'},
                                          {value: 3, label: '3-days'},
                                          {value: 7, label: '7-days'},
                                          {value: 14, label: '14-days'},
                                      ]}/>
                <ControlPanelDropDown label='Data Sets'
                                      options={[
                                          {value: 'ALL', label: 'All Lines'},
                                      ].concat(LINES.map(l => {
                                          return {value: l.sourceProperty, label: `Only ${l.label}`}
                                      }))}
                                      settings={props.settings}
                                      onSettingsChange={props.onSettingsChange}
                                      propertyName='dataLinesId'/>
                <ControlPanelDropDown label='Vertical Scale Type'
                                      settings={props.settings}
                                      onSettingsChange={props.onSettingsChange}
                                      propertyName='verticalScaleType'
                                      options={[
                                          {value: 'linear', label: 'Linear'},
                                          {value: 'log', label: 'Logarithmic'},
                                      ]}/>
                {props.showNullStrategy ?
                    <ControlPanelDropDown label='Missing Data Handling'
                                          settings={props.settings}
                                          onSettingsChange={props.onSettingsChange}
                                          propertyName='nullStrategy'
                                          options={[
                                              {value: 'none', label: 'Do not plot'},
                                              {value: 'leadingNullAsZero', label: 'Treat leading gaps as zeros'}
                                          ]}/> : null
                }
            </form>
            <RegionSelector
                warningsByRegion={props.normalizedRecordSet.warningsByRegion}
                regionSpec={props.regionSpec}
                initialSelections={props.settings.selectedRegions}
                userQuickPicks={props.settings.userQuickPicks}
                onSelectionChange={createSettingsChangeHandler('selectedRegions')}
                onUserQuickPicksChange={createSettingsChangeHandler('userQuickPicks')}
            />
        </div>)

}

ControlPanel.propTypes = {
    settings: PropTypes.object.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    showNullStrategy: PropTypes.bool.isRequired,
    regionSpec: PropTypes.object.isRequired,
    normalizedRecordSet: PropTypes.object.isRequired
}
