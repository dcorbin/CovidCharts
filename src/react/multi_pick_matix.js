import React from "react";

export default class MultiPickMatrix extends React.Component {
    constructor(props) {
        super(props);
        let selections = new Set(this.props.initialSelections);
        this.state = {
            selections: selections
        };

        this.valueClicked = this.valueClicked.bind(this)
    }

    valueClicked(e) {
        e.preventDefault();
        let selectionClicked = e.currentTarget.dataset.id
        let selections = this.state.selections
        if (selections.has(selectionClicked)) {
            selections.delete(selectionClicked)
        } else {
            selections.add(selectionClicked)
        }
        this.setState({selections: selections})
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange([...selections])
        }
    }

    render() {
        let columns = this.props.columns
        let values = [...this.props.allValues].sort(this.byName)
        let rowCount = Math.ceil((values.length / columns) + .99)
        let rows = []
        for (let i = 0; i<rowCount; i++) {
            rows.push([])
        }
        for (let c=0; c<columns; c++) {
            for (let r=0; r<rowCount; r++) {
                let value = values.shift()
                if (value != null)
                    rows[r].push(value)
            }
        }

        let tableStyle = {width: '100%', "backgroundColor": "#e0e0e0", margin: '4px' };
        let cellStyle = {width: String(100/columns)+"%"}
        return <table style={tableStyle}><tbody>{
                rows.map((row, index) => {
                    return <tr key={index}>{
                            row.map(value => {
                                let selected = this.state.selections.has(value)
                                let classes = ['selectable']
                                if (selected) {
                                    classes.push("selected")
                                }
                                return <td className={ classes.join(' ') }
                                           data-id={value}
                                           onClick={this.valueClicked}
                                           style={cellStyle} key={value}>
                                    <img className='indicator' alt="Selected" style={{width: 8, height:8, verticalAlign: 'middle'}}
                                         src='/circle-16.png'/>
                                    &nbsp;
                                    <span>{this.props.valueRenderer(value)}</span>
                                </td>
                            })
                        }</tr>
                })

        }<tr><td colSpan={columns}><br/>{this.props.footer}</td></tr></tbody></table>
    }
}
MultiPickMatrix.defaultProps = {columns: 8}