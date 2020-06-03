import React from "react";

export default function SelectionIndicator(props) {
    return <img className='indicator' alt="Selected"
                style={{width: 8, height: 8, verticalAlign: 'middle'}}
                src='/circle-16.png'/>
}

SelectionIndicator.propTypes = {}