import React from "react";
import Classification from "../model/classification";
import PropTypes from "prop-types";

ClassificationLegendEntry.propTypes = {
    classification: PropTypes.instanceOf(Classification).isRequired,
    count: PropTypes.string
}
function ClassificationLegendEntry(props) {
    let blockText = <span>&nbsp</span>;
    if (props.count.length > 0) blockText = props.count
    return <div className='ClassificationLegendEntry'>
        <div className={`block ${props.classification.className}`} >{blockText}</div>
        <div className='label'>{props.classification.description}</div>
    </div>
}

GrowthLegend.propTypes = {
    classifications: PropTypes.arrayOf(PropTypes.instanceOf(Classification)).isRequired,
    countForClassificationName: PropTypes.func
}
export default function GrowthLegend(props) {
    return <div className='GrowthLegend'>
        {props.classifications.map(classification => {
            let count = ""
            if (props.countForClassificationName) count = props.countForClassificationName(classification.className)

            return <ClassificationLegendEntry
                key={classification.className}
                count={count}
                classification={classification}/>
        })
        }

    </div>
}