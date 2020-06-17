import React from "react";
import PropTypes from "prop-types";
import PROP_TYPES from "./model/prop_types";
import {GrowthRanker} from "./model/growth_ranker";
import './growth_ranking.css'

GrowthRanking.propTypes = {
    recordSet: PropTypes.object.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
}
Percent.defaultProps = {
    value: null,
    precision: 0
}
Percent.propTypes = {
    value: PropTypes.number,
    precision: PropTypes.number
}
function Percent(props) {
    if (isNaN(props.value)) {
        return <span className='infinity'>-</span>
    }
    if (props.value === Infinity) {
        return <span className='infinity'>{'\u221e'}</span>
    }
    if (props.value === -Infinity) {
        return -<span className='infinity'>{'\u221e'}</span>
    }
    return String(props.value.toFixed(1)) + '%'

}

export default function GrowthRanking(props) {
    function categoryClassName(percentage) {
        if (percentage >= 50) {
            return 'highGrowth'
        }
        if (percentage >= 10) {
            return 'lowGrowth'
        }
        if (percentage <= -50) {
            return 'highShrink'
        }
        if (percentage <= -10) {
            return 'lowShrink'
        }
        return 'stable'
    }

    let scoredRegions = new GrowthRanker().rank(props.recordSet.records);

    let ranked_regions = scoredRegions.filter((row) => !isNaN(row.new_positives.percentage)).sort((a, b) => {
        return b.new_positives.percentage - a.new_positives.percentage;
    }).concat(scoredRegions.filter((row) => isNaN(row.new_positives.percentage)))
    return <div className='GrowthRanking'>
        <table>
            <thead>
                <tr className='row'>
                    <th className='cell'> </th>
                    <th colSpan="3" className='cell'>Positive Growth</th>
                </tr>
                <tr className='row'>
                    <th className='cell'>{props.regionSpec.singleNoun.charAt(0).toUpperCase()}{props.regionSpec.singleNoun.substr(1)}</th>
                    <th className='cell percentage'>Rate (7 days)</th>
                    <th className='cell value'>per Day</th>
                    <th className='cell value'>Current Daily</th>
                </tr>
            </thead>
            <tbody>
            {
                ranked_regions.map(record => {
                    let category = categoryClassName(record.new_positives.percentage);
                    return (
                        <tr key={record.region}
                             className={`row`}>
                            <td className='cell growthRegion'>
                                {props.regionSpec.displayNameFor(record.region)}
                            </td>
                            <td className={`cell number percentage ${category}`}>
                                <Percent value={record.new_positives.percentage}/>
                            </td>
                            <td className={`cell number value ${category}`}>
                                {record.new_positives.delta.toFixed(3)}
                            </td>
                            {/*<td className={`cell number value ${category}`}>*/}
                            {/*    {record.new_positives.currentValue.toFixed(0)}*/}
                            {/*</td>*/}
                        </tr>
                    )
                })
            }</tbody>
        </table>

    </div>
}