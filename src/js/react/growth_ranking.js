import React from "react";
import PropTypes from "prop-types";
import PROP_TYPES from "./model/prop_types";
import {TrendAnalyzer} from "../model/trends/trend_analyzer";
import './growth_ranking.css'
import TrendPercentage from "./trend_percentage";

GrowthRanking.propTypes = {
    recordSet: PropTypes.object.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
}


export default function GrowthRanking(props) {
    function categoryClassName(percentage) {
        if (percentage === null || isNaN(percentage))
            return "barren"

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

    let scoredRegions = new TrendAnalyzer().calculateTrendsForAllRegions(props.recordSet.records);

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
                scoredRegions.map(record => {
                    let category = categoryClassName(record.deltaPositive.percentage);
                    console.log(`${record.region} ${record.deltaPositive.percentage}`)
                    return (
                        <tr key={record.region}
                             className={`row`}>
                            <td className='cell growthRegion'>
                                {props.regionSpec.displayNameFor(record.region)}
                            </td>
                            <td className={`cell number percentage ${category}`}>
                                <TrendPercentage value={record.deltaPositive.percentage}/>
                            </td>
                            <td className={`cell number value ${category}`}>
                                {record.deltaPositive.delta.toFixed(3)}
                            </td>
                            <td className={`cell number value ${category}`}>
                                {record.deltaPositive.currentValue.toFixed(0)}
                            </td>
                        </tr>
                    )
                })
            }</tbody>
        </table>

    </div>
}