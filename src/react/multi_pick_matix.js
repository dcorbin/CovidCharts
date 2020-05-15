import React, {useState} from "react";

export default function MultiPickMatrix(props) {
        const [selections, setSelections] = useState(new Set(props.initialSelections))
        function valueClicked(e) {
            e.preventDefault();
            let selectionClicked = e.currentTarget.dataset.id
            let adjustedSelections = new Set([...selections])
            if (selections.has(selectionClicked)) {
                adjustedSelections.delete(selectionClicked)
            } else {
                adjustedSelections.add(selectionClicked)
            }
            setSelections(new Set(adjustedSelections))
            if (props.onSelectionChange) {
                props.onSelectionChange(Array.from(adjustedSelections))
            }
        }

        let columns = props.columns
        let values = [...props.allValues]
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
                                let selected = selections.has(value)
                                let classes = ['selectable']
                                if (selected) {
                                    classes.push("selected")
                                }
                                return <td className={ classes.join(' ') }
                                           data-id={value}
                                           onClick={valueClicked}
                                           style={cellStyle} key={value}>
                                    <img className='indicator' alt="Selected" style={{width: 8, height:8, verticalAlign: 'middle'}}
                                         src='/circle-16.png'/>
                                    &nbsp;
                                    <span>{props.valueRenderer(value)}</span>
                                </td>
                            })
                        }</tr>
                })

        }<tr><td colSpan={columns}><br/>{props.footer}</td></tr></tbody></table>
    }
