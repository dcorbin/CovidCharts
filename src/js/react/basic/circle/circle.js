import React from "react";
import PropTypes from 'prop-types'
import './circle.css'

export default function Circle(props) {
    return (
        <span className='defaultCircle'>
            <span style={{width: '8px', height: '8px'}} className={props.className}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox={`0 0 ${props.size} ${props.size}`}
                height={props.size}
                width={props.size}>
                    <circle
                        r={props.size/2}
                        cy={props.size/2}
                        cx={props.size/2}
                    />
                </svg>
            </span>
            </span>)
}

Circle.defaultProps = {
    className: 'Circle',
    size: 20
}
Circle.propTypes = {
    className: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}
