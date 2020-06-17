import React from "react";
import PropTypes from "prop-types";
import PROP_TYPES from "./model/prop_types";
import {GrowthRanker} from "./model/growth_ranker";
import './growth_ranking.css'

GrowthRanking.propTypes = {
    recordSet: PropTypes.object.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
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
    function formatPercentage(n) {
        if (isNaN(n)) {
            return "-"
        }
        return String(n.toFixed(1)) + '%'
    }

    let scoredRegions = new GrowthRanker().rank(props.recordSet.records);

    let ranked_regions = scoredRegions.filter((row) => !isNaN(row.new_positives.percentage)).
        sort((a,b) => {
            return b.new_positives.percentage - a.new_positives.percentage;
        }).
        concat(scoredRegions.filter((row) => isNaN(row.new_positives.percentage)))
    return <div className='GrowthRanking'>
            <div className='row'>
                <div className='cell header'>{props.regionSpec.singleNoun}</div>
                <div className='cell header'>Positive Growth Percentage</div>
                <div className='cell header'>Positive Growth per Day</div>
            </div>{
        ranked_regions.map(record => {
            return (
                <div key={record.region} className={`row ${categoryClassName(record.new_positives.percentage)}`}>
                    <div className='cell growthRegion'>
                        {props.regionSpec.displayNameFor(record.region)}
                    </div>
                    <div className='cell number'>
                        {formatPercentage(record.new_positives.percentage)}
                    </div>
                    <div className='cell number'>
                        {record.new_positives.delta.toFixed()}
                    </div>
                </div>
            )
        })
    }

    </div>
}