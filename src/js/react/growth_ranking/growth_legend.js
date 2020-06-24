import React from "react";

export default function GrowthLegend(props) {
    function ClassificationLegendEntry(props) {
        return <div className='ClassificationLegendEntry'>
            <div className={`block ${props.classification.className}`} >&nbsp;</div>
            <div className='label'>{props.classification.description}</div>
        </div>
    }

    return <div className='GrowthLegend'>
        {props.classifications.map(classification => {
            return <ClassificationLegendEntry key={classification.className} classification={classification}/>
        })
        }

    </div>
}