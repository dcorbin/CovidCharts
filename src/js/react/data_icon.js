import React from "react";
import PropTypes from 'prop-types'

export default function DataIcon(props) {
   return <img
                alt={props.label}
                title={props.label}
                style={{
                    width: 12,
                    height: 12,
                    verticalAlign: 'middle',
                    paddingLeft: '2px',
                    paddingRight: '2px'
                }}
                src={props.url}/>
}

DataIcon.propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.string
}