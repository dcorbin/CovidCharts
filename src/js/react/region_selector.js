import React, {useState} from "react";
import ArraySummary from "./array_summary";
import ColumnarMatrix from "./columnar_matrix/columnar_matrix";
import SelectableValue from "./selectable_value";
import useCollapsable from "./hooks/collapsable/use_collapsable";
import QuickPickButtonBar from "./quickpick/quick_pick_button_bar";
import DataIcon from "./data_icon";
import SvgMap from "./maps/svg_map";
import QuickPick from "../model/quick_pick";
import useWindowDimensions from "./hooks/use_window_dimensions";
import './hooks/region_selection/region_selection.css'
import PropTypes from "prop-types";
import DownloadedMap from "./maps/downloaded_map";

class WarningRenderer {
    static footerFor(type) {
        if (type === 'noHosp') {
            return <span key={type}><DataIcon url='/data/hospitalized.png'/>No data on hospitalizations. &nbsp;</span>
        }
        if (type === 'broken') {
            return <span key={type}> <DataIcon url='/data/broken.svg'/> Some data is missing. &nbsp;</span>
        }
        return null
    }
    static renderIcon(warning) {
        if (warning.type === 'noHosp') {
            return <DataIcon key="no_hosp" label='No data on hospitalizations'
                              url={'/data/hospitalized.png'}/>
        }
        if (warning.type === 'broken') {
            return <DataIcon key={'broken'} label={'Missing data: ' + warning.renderingDetails.join(', ')}
                             url='/data/broken.svg'/>
        }
        return null
    }
}

RegionSelector.propTypes = {
    warningsByRegion: PropTypes.object.isRequired,
    regionSpec: PropTypes.object.isRequired,
    initialSelections: PropTypes.array.isRequired,
    userQuickPicks: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    onUserQuickPicksChange: PropTypes.func.isRequired
}


export default function RegionSelector(props) {
    const warningsByRegions = props.warningsByRegion
    const regionSpec = props.regionSpec
    const userQuickPicks = props.userQuickPicks
    const allRegions = warningsByRegions.regions

    const [selectedRegions, setSelectedRegions] = useState(props.initialSelections)
    const [hoverRegion, setHoverRegion] = useState(null)
    const {width, height} = useWindowDimensions()

    const matrixWidth = width * regionSpec.matrixMapRatio[0] / (regionSpec.matrixMapRatio.reduce((a,b) => a + b)) - 20
    let columns = Math.floor(matrixWidth / regionSpec.minimumCellWidth )
    if (columns < 0) {
        columns = 1
    } else if (columns > regionSpec.columns) {
        columns = regionSpec.columns
    }

    function deleteQuickPick(quickPick) {
        props.onUserQuickPicksChange(userQuickPicks.filter(pick => pick.name !== quickPick.name))
    }

    function createNewQuickPick(name) {
        let picks = regionSpec.quickPicks.concat(userQuickPicks)
        if (picks.some(qpb => qpb.name === name)) {
            return `Quick Pick named '${name}' already exists.`
        }
        let key = "_" + name
        let copiedQuickPicks = [...userQuickPicks]
        copiedQuickPicks.push(QuickPick.createUserManaged(key, name, selectedRegions))
        props.onUserQuickPicksChange(copiedQuickPicks)
        return null
    }

    function regionClicked(clickedValue) {
        function adjustedSelections(clickedValue, selections) {
            if (selections.some(p => p === clickedValue)) {
                selections.splice (selections.indexOf(clickedValue), 1);
            } else {
                selections.push(clickedValue)
            }
            return selections
        }
        let newSelections = adjustedSelections(clickedValue, [...selectedRegions]);
        setSelectedRegions(newSelections)
        props.onSelectionChange(newSelections)
    }


    function collapsedRegionSelectionPanel() {
        return <ArraySummary singleNoun={regionSpec.singleNoun}
                             pluralNoun={regionSpec.pluralNoun}
                             values={selectedRegions.map(s => regionSpec.displayNameFor(s))}/>
    }

    function renderWarningFooters() {
        let uniqueTypes = warningsByRegions.warningTypes();
        return uniqueTypes.map(type => WarningRenderer.footerFor(type))
    }

    function onHover(region) {
        setHoverRegion(region)
    }

    function regionSelectionPanel() {
        let footers = renderWarningFooters();
        function gridTemplate(regionSpec) {
            return {
                gridTemplateColumns: regionSpec.matrixMapRatio.map(value => `${value}fr`).join(' ')
            }
        }


        return <div className='RegionSelection'>
                <div>
                    <QuickPickButtonBar quickPicks={regionSpec.quickPicks.concat(userQuickPicks)}
                                        regions={allRegions}
                                        onCreateNew={(name) => createNewQuickPick(name)}
                                        onDeleteQuickPick={(quickPick => deleteQuickPick(quickPick))}
                                        onClick={(regions) => {
                                         setSelectedRegions(regions)
                                         props.onSelectionChange(regions)
                                     }}
                    />
                </div>
                <div className='RegionSelectionMain' style={gridTemplate(regionSpec)}>
                    <div>
                        <ColumnarMatrix values={allRegions}
                                        columns={columns}
                                        onValueClicked={regionClicked}
                                        onHover={onHover}
                                        valueRenderer={value => {
                                            let selected = selectedRegions.includes(value)
                                            let hover = hoverRegion === value
                                            return <SelectableValue value={value}
                                                                    valueRenderer={region => {
                                                                        return <span>{regionSpec.displayNameFor(region)}{warningsByRegions.warningsFor(region).map(w => WarningRenderer.renderIcon(w))}</span>
                                                                    }}
                                                                    hover={hover}
                                                                    selected={selected}/>;
                                        }}
                        />
                    </div>
                    <div style={{margin: '10px'}}>{(
                        <DownloadedMap
                            mapURI={regionSpec.mapURI}
                            hoverLocation={hoverRegion}
                            onRegionSelected={regionClicked}
                            onHover={onHover}
                            classNamesProvider={(region) => {
                                let classNames = []
                                if (selectedRegions.includes(region)) {
                                    classNames.push('selected')
                                }
                                if (hoverRegion === region) {
                                    classNames.push('hover')
                                }
                                return classNames
                            }}/>
                    )}</div>
                </div>
                <div>&nbsp;</div>
                <div className='footer'> {footers}</div>
            </div>;
    }

    return useCollapsable(regionSelectionPanel, collapsedRegionSelectionPanel, 'RegionSelector')
}
