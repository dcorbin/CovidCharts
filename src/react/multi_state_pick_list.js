import React from "react";
import {StateTable} from '../states'

export default class MultiRegionPickList extends React.Component {
    constructor(props) {
        super(props);
        let selectedRegions = new Set(this.props.initialRegions);
        this.state = {
            selectedRegions: selectedRegions
        };

        this.regionClicked = this.regionClicked.bind(this)
    }

    byName(a, b) {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
    }

    regionClicked(e) {
        e.preventDefault();
        let regionClicked = e.currentTarget.dataset.id
        let selections = this.state.selectedRegions
        if (selections.has(regionClicked)) {
            selections.delete(regionClicked)
        } else {
            selections.add(regionClicked)
        }
        this.setState({selectedRegions: selections})
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange([...selections])
        }
    }

    render() {
        let columns = this.props.columns
        let regions = [...this.props.all].sort(this.byName)
        let rows = []
        while (regions.length > columns) {
            rows.push(regions.splice(0, columns))
        }
        rows.push(regions)

        let tableStyle = {width: '100%', "backgroundColor": "#e0e0e0", margin: '4px' };
        let cellStyle = {width: String(100/columns)+"%"}
        return <table style={tableStyle}><tbody>{
                rows.map((row, index) => {
                    return <tr key={index}>{
                            row.map(region => {
                                let selected = this.state.selectedRegions.has(region.abbreviation)
                                let classes = ['selectableRegion']
                                if (selected) {
                                    classes.push("selected")
                                }
                                return <td className={ classes.join(' ') }
                                           data-id={region.abbreviation}
                                           onClick={this.regionClicked}
                                           style={cellStyle} key={region.abbreviation}>
                                    {region.name}
                                </td>
                            })
                        }</tr>
                })
        }</tbody></table>
    }
}
MultiRegionPickList.defaultProps = {columns: 8}