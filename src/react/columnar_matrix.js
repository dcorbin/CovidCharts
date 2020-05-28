import React from "react";
import PropTypes from 'prop-types'

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
    return <div className={props.className}><table>
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

ColumnarMatrix.defaultProps = {
    valueRenderer: (id) => id,
    className: 'ColumnarMatrix'
}

ColumnarMatrix.propTypes = {
    onValueClicked: PropTypes.func,
    columns: PropTypes.number.isRequired,
    values:PropTypes.arrayOf(PropTypes.string).isRequired,
    valueRenderer: PropTypes.func,
    className: PropTypes.string,
}