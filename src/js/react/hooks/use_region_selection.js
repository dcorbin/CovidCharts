import React, {useState} from "react";
import ArraySummary from "../array_summary";
import ColumnarMatrix from "../columnar_matrix";
import SelectableValue from "../selectable_value";
import useCollapsable from "./use_collapsable";
import QuickPickButtonBar from "../quick_pick_button_bar";
import DataIcon from "../data_icon";
import SvgMap from "../maps/svg_map";
import QuickPick from "../../model/quick_pick";
import useWindowDimensions from "./use_window_dimensions";

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
export default function useRegionSelection(initialSelections,
                                           selectionStrategy,
                                           recordSet,
                                           regionSpec,
                                           allRegions,

                                           userQuickPicks,
                                           onSelectionChange,
                                           onUserQuickPicksChange
                                           ) {

    const [selectedRegions, setSelectedRegions] = useState(initialSelections)
    const [hoverRegion, setHoverRegion] = useState(null)
    const [regionMap, setRegionMap] = useState(regionSpec.map)
    const {width, height} = useWindowDimensions()
    const matrixWidth = width * regionSpec.matrixMapRatio[0] / (regionSpec.matrixMapRatio.reduce((a,b) => a + b)) - 20
    let columns = Math.floor(matrixWidth / regionSpec.minimumCellWidth )
    if (columns < 0) {
        columns = 1
    } else if (columns > regionSpec.columns) {
        columns = regionSpec.columns
    }
    if (!regionMap)
        initiateMapFetch(regionSpec.mapURI)

    function deleteQuickPick(quickPick) {
        onUserQuickPicksChange(userQuickPicks.filter(pick => pick.name !== quickPick.name))
    }

    function createNewQuickPick(name) {
        let picks = regionSpec.quickPicks.concat(userQuickPicks)
        if (picks.some(qpb => qpb.name === name)) {
            return `Quick Pick named '${name}' already exists.`
        }
        let key = "_" + name
        let copiedQuickPicks = [...userQuickPicks]
        copiedQuickPicks.push(QuickPick.createUserManaged(key, name, selectedRegions))
        onUserQuickPicksChange(copiedQuickPicks)
        return null
    }

    function initiateMapFetch(uri) {
        fetch(uri, {method: 'GET', })
            .then(
                response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                    console.log(`STATUS: ${response.status}`)
                    response.text().then(t => console.log(`JSON: ${t}`))
                    return null
                }
            )
            .then(json => setRegionMap(json))
        return null
    }

    function matrixItemClicked(clickedValue) {
        let newSelections = selectionStrategy(clickedValue, [...selectedRegions]);
        setSelectedRegions(newSelections)
        onSelectionChange(newSelections)
    }


    function collapsedRegionSelectionPanel() {
        return <ArraySummary singleNoun={regionSpec.singleNoun}
                             pluralNoun={regionSpec.pluralNoun}
                             values={selectedRegions.map(s => regionSpec.displayNameFor(s))}/>
    }

    function renderWarningFooters() {
        let uniqueTypes = recordSet.warningTypes();
        return uniqueTypes.map(type => WarningRenderer.footerFor(type))
    }

    function onHover(region) {
        setHoverRegion(region)
    }

    function regionSelectionPanel() {
        let footers = renderWarningFooters();
        function mapSection(map) {
            if (!map) {
                return null
            }
            return (
                <SvgMap
                    map={map}
                    hoverLocation={hoverRegion}
                    onClick={matrixItemClicked}
                    onHover={onHover}
                    classNamesProvider={(region) => {
                        if (selectedRegions.includes(region)) {
                            return ['selected']
                        }
                        return []
                    }}/>
            )
        }

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
                                         onSelectionChange(regions)
                                     }}
                    />
                </div>
                <div className='RegionSelectionMain' style={gridTemplate(regionSpec)}>
                    <div>
                        <ColumnarMatrix values={allRegions}
                                        columns={columns}
                                        onValueClicked={matrixItemClicked}
                                        onHover={onHover}
                                        hoverValue={hoverRegion}
                                        valueRenderer={value => {
                                            let selected = selectedRegions.includes(value)
                                            return <SelectableValue value={value}
                                                                    valueRenderer={region => {
                                                                        return <span>{regionSpec.displayNameFor(region)}{recordSet.warningsFor(region).map(w => WarningRenderer.renderIcon(w))}</span>
                                                                    }}
                                                                    selected={selected}/>;
                                        }}
                        />
                    </div>
                    <div style={{margin: '10px'}}>{mapSection(regionMap)}</div>
                </div>
                <div>&nbsp;</div>
                <div className='footer'> {footers}</div>
            </div>;
    }

    let formattedRegionList = selectedRegions.map(region => regionSpec.displayNameFor(region)).join(", ")
    const displayContent = useCollapsable(regionSelectionPanel, collapsedRegionSelectionPanel, 'RegionSelection')
    return [displayContent, selectedRegions, formattedRegionList]
}
