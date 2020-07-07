import React from "react";
import Classification from "../model/classification";
import PropTypes from "prop-types";
import {PopupActivatingButton} from "../basic/popup/popup_activating_button";
import './growth_legend.css'
import InfoIcon from "../basic/chart_icon/info_icon";
ClassificationLegendEntry.propTypes = {
    classification: PropTypes.instanceOf(Classification).isRequired,
    count: PropTypes.string
}
function ClassificationLegendEntry(props) {
    let blockText = <span>&nbsp</span>;
    if (props.count.length > 0) blockText = props.count
    console.log(`DEBUG: typeof(classification.description) ${typeof(props.classification.description)}`)
    console.log(`DEBUG: classification.description ${props.classification.description}`)
    const label = props.classification.description.replaceAll(" ", "\u00a0");
    return <div
        className='ClassificationLegendEntry'>
        <div className={`block ${props.classification.className}`}>{blockText}</div>
        <div className='label'>{label}</div>
    </div>
}

GrowthLegend.propTypes = {
    classifications: PropTypes.arrayOf(PropTypes.instanceOf(Classification)).isRequired,
    countForClassificationName: PropTypes.func,
    infoBlock: PropTypes.string
}
export default function GrowthLegend(props) {
    function infoBlock() {
        return (
            <div className="infoBlock tooltip"><InfoIcon/>
                <span className="tooltipText">{props.infoBlock}</span>
            </div>
            )
    }
    return <div className='GrowthLegend'>
        {props.infoBlock ? infoBlock() : null}
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