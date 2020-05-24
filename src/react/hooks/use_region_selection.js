import React, {useState} from "react";
import ArraySummary from "../array_summary";
import ColumnarMatrix from "../columnar_matrix";
import SelectableValue from "../selectable_value";
import useCollapsable from "./use_collapsable";
import RegionQuickPick from "../region_quick_pick";
import DataIcon from "../data_icon";

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
                                           columns,
                                           onSettingsChange,
                                           ) {

    const [selectedRegions, setSelectedRegions] = useState(initialSelections)

    function matrixItemClicked(clickedValue) {
        let newSelections = selectionStrategy(clickedValue, [...selectedRegions]);
        setSelectedRegions(newSelections)
        onSettingsChange(newSelections)
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

    function regionSelectionPanel() {
        let footers = renderWarningFooters();
        return <div className='RegionSelection'>
            <div className='RegionSelectionMain'>
                <ColumnarMatrix values={allRegions}
                                columns={columns}
                                onValueClicked={matrixItemClicked}
                                valueRenderer={value => {
                                    let selected = selectedRegions.includes(value)
                                    return <SelectableValue value={value}
                                                            valueRenderer={region => {
                                                                return <span>{regionSpec.displayNameFor(region)}{recordSet.warningsFor(region).map(w => WarningRenderer.renderIcon(w))}</span>
                                                            }}
                                                            selected={selected}/>;
                                }}
                />
                <RegionQuickPick quickPicks={regionSpec.quickPicks}
                                 regions={allRegions}
                                 onClick={(regions) => {
                                     setSelectedRegions(regions)
                                     onSettingsChange(regions)
                                 }}/>
            </div>
            <div>&nbsp;</div>
            <div className='footer'> {footers}</div>

        </div>;
    }

    let formattedRegionList = selectedRegions.map(region => regionSpec.displayNameFor(region)).join(", ")
    const displayContent = useCollapsable(regionSelectionPanel, collapsedRegionSelectionPanel, 'RegionSelection')
    return [displayContent, selectedRegions, formattedRegionList]
}
