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
    return <div className={"ColumnarMatrix Table"}>
            {
                rows.map((row, index) => {
                    return <div className='Row' key={index}>
                        {
                            row.map(value => {
                                let className = props.hoverValue === value ? 'hover' : ''
                                return <div
                                    className={'Region ' + className}
                                    data-id={value}
                                    onClick={valueClicked}
                                    onMouseEnter={(e) => props.onHover(value)}
                                    onMouseLeave={(e) => props.onHover(null)}
                                    style={cellStyle} key={value}>
                                    {props.valueRenderer(value)}
                                </div>
                            })
                        }</div>
                })

            }
    </div>
}

ColumnarMatrix.defaultProps = {
    valueRenderer: (value) => value,
        className: 'ColumnarMatrix',
    hoverValue: null,
    onHover: (value) => {},
}

ColumnarMatrix.propTypes = {
    columns: PropTypes.number.isRequired,
    hoverValue: PropTypes.string,
    values:PropTypes.arrayOf(PropTypes.string).isRequired,
    className: PropTypes.string,
    valueRenderer: PropTypes.func,
    onHover: PropTypes.func,
    onValueClicked: PropTypes.func,
}