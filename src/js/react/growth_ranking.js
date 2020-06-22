import React from "react";
import PropTypes from "prop-types";
import PROP_TYPES from "./model/prop_types";
import {TrendAnalyzer} from "../model/trends/trend_analyzer";
import './growth_ranking.css'
import './growth_ranking_colors.css'
import TrendPercentage from "./trend_percentage";
import DownloadedMap from "./maps/downloaded_map";
import {createMappingComparator} from "../util/comparator";

Value.defaultProps = {
    precision: 0
}
Value.propTypes = {
    value: PropTypes.number,
    precision: PropTypes.number
}
function Value(props) {
    if (props.value === null) {
        return "-"
    }
    return props.value.toFixed(props.precision)
}
GrowthRanking.propTypes = {
    height: PropTypes.number.isRequired,
    recordSet: PropTypes.object.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
}

class Classification {
    constructor(className, description, requirement, displayOrder) {
        this.className = className
        this.description = description
        this.requirement = requirement
        this.displayOrder = displayOrder
    }
}
const CLASSIFICATIONS = [
    new Classification("barren", "Barren", p => {return isNaN(p) || p === null}, 10),
    new Classification("bad3", ">= 100%", p => p >= 100, 1),
    new Classification("bad2", "50 - 100%", p => p >= 50, 2),
    new Classification("bad1", "10 - 50%", p => p >= 10, 3),
    new Classification("neutral", "-10 - 10%", p => p > -10, 4),
    new Classification("good1", "-50 - -10%", p => p > -50, 5),
    new Classification("good2", "-100 - -50%", p => p > -100, 6),
    new Classification("allClear", "All Clear", p => true, 7),
]

function GrowthLegend(props) {
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

export default function GrowthRanking(props) {
    function categoryClassName(percentage) {
        if (percentage === null) {
            percentage = -Infinity
        }
        let classification = CLASSIFICATIONS.
            sort(createMappingComparator(p => p.displayOrder)).
            find(c => c.requirement(percentage))
        if (classification === null) {
            console.log("Unable to classify " + percentage)
            return ''
        }
        return classification.className;
    }

    let scoredRegions = new TrendAnalyzer().calculateTrendsForAllRegions(props.recordSet.records);
    let categoryByRegion = scoredRegions.reduce((result, record) => {
        result[record.region] = categoryClassName(record.deltaPositive.percentage);
        return result
    }, {})

    function renderTable() {
        return <table>
            <thead>
            <tr className='row'>
                <th className='cell'> </th>
                <th colSpan="3" className='cell'>Positive Growth (7-day Avg)</th>
            </tr>
            <tr className='row'>
                <th className='cell'>{props.regionSpec.singleNoun.charAt(0).toUpperCase()}{props.regionSpec.singleNoun.substr(1)}</th>
                <th className='cell'>Growth over (7 days)</th>
                {/*<th className='cell'>per Day</th>*/}
                <th className='cell'>Current</th>
                {/*<th className='cell'>7d Avg - 14d Avg</th>*/}
                {/*<th className='cell'>as a Percent</th>*/}
                {/*<th className='cell'>Danger Score</th>*/}
            </tr>
            </thead>
            <tbody>
            {
                scoredRegions.map(record => {
                    let category = categoryByRegion[record.region]
                    return (
                        <tr key={record.region}
                            className={`row`}>
                            <td className='cell growthRegion'>
                                {props.regionSpec.displayNameFor(record.region)}
                            </td>
                            <td className={`cell number percentage ${category}`}>
                                <TrendPercentage value={record.deltaPositive.percentage}/>
                            </td>
                            {/*<td className={`cell number value ${category}`}>*/}
                            {/*    <Value value={record.deltaPositive.delta} precision={2}/>*/}
                            {/*</td>*/}
                            <td className={`cell number value ${category}`}>
                                <Value value={record.deltaPositive.sevenDayAvg} precision={2}/>
                            </td>
                            {/*<td className={`cell number value ${category}`}>*/}
                            {/*    <Value value={record.deltaPositive.sevenFourteen} precision={2}/>*/}
                            {/*</td>*/}
                            {/*<td className={`cell number percentage ${category}`}>*/}
                            {/*    <TrendPercentage value={record.deltaPositive.sevenFourteenPercentage}/>*/}
                            {/*</td>*/}
                            {/*<td className={`cell number percentage ${category}`}>*/}
                            {/*    <Value value={record.deltaPositive.dangerScore} precision={2}/>*/}
                            {/*</td>*/}
                        </tr>
                    )
                })
            }</tbody>
        </table>;
    }

    return <div className='GrowthRanking' style={{height: props.height - 30}}>
        <div className='verticalScroll' style={{overflowY: 'auto'}}>{renderTable()}</div>
        <div className='fixed'>
            <GrowthLegend classifications={CLASSIFICATIONS} />
            <DownloadedMap mapURI={props.regionSpec.mapURI} classNamesProvider={
            (region) => {
                return  [categoryByRegion[region]]
            }
        }/>
        </div>
    </div>
}