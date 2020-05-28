import React from "react";

export default function ColumnarMatrix(props) {
    function valueClicked(e) {
        e.preventDefault();
        let clickedValue = e.currentTarget.dataset.id

        if (props.onValueClicked) {
            props.onValueClicked(clickedValue)
        }
    }

    let columns = props.columns
    let values = [...props.values]
    let rowCount = Math.ceil((values.length / columns))
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

    let cellStyle = {width: String(100/columns)+"%"}
    return <div className='ColumnarMatrix'><table>
            <tbody>{
                rows.map((row, index) => {
                    return <tr key={index}>
                        {
                            row.map(value => {
                                return <td
                                    data-id={value}
                                    onClick={valueClicked}
                                    style={cellStyle} key={value}>
                                    {props.valueRenderer(value)}
                                </td>
                            })
                        }</tr>
                })

            }
            </tbody>
        </table>
    </div>
}
