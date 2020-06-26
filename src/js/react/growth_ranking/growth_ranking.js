import React, {useState} from "react";
import PropTypes from "prop-types";
import PROP_TYPES from "../model/prop_types";
import {TrendAnalyzer} from "../../model/trends/trend_analyzer";
import './growth_ranking.css'
import './growth_ranking_colors.css'
import TrendPercentage from "./trend_percentage";
import DownloadedMap from "../maps/downloaded_map";
import PositiveGrowthClassifier from "../../model/trends/postiive_growth_classirifer";
import scrollIntoView from "scroll-into-view-if-needed";
import TrendValue from "./trend_value";
import GrowthLegend from "./growth_legend";
import {PopupActivatingButton} from "../basic/popup/popup_activating_button";
import ChartIcon from "../basic/chart_icon/chart_icon";

GrowthRanking.propTypes = {
    height: PropTypes.number.isRequired,
    recordSet: PropTypes.object.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
}

export default function GrowthRanking(props) {
    let [hover, setHover] = useState(null)
    let scoredRegions = new TrendAnalyzer().calculateTrendsForAllRegions(props.recordSet.records);
    let categoryByRegion = scoredRegions.reduce((result, record) => {
        result[record.region] = new PositiveGrowthClassifier().
            categoryClassName(record.deltaPositive.percentage, record.region);
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
                <th className='cell'>Current</th>
            </tr>
            </thead>
            <tbody>
            {
                scoredRegions.map(record => {
                    let category = categoryByRegion[record.region]
                    let rowClassNames = ['row']
                    if (record.region === hover) {
                        rowClassNames.push('hover')
                    }
                    return (
                        <tr key={record.region}
                            id={`table_row_${record.region}`}
                            onMouseEnter={(e) => highlightRegion(record.region)}
                            onMouseLeave={(e) => highlightRegion(null)}
                            className={rowClassNames.join(' ')}>
                            <td className={`cell growthRegion`}>
                                <PopupActivatingButton
                                    popupContent={() => <span>{record.region}</span>}
                                    linkContent={() => <ChartIcon/>}/>
                                {props.regionSpec.displayNameFor(record.region)}
                            </td>
                            <td className={`cell number percentage ${category}`}>
                                <TrendPercentage value={record.deltaPositive.percentage}/>
                            </td>
                            <td className={`cell number value ${category}`}>
                                <TrendValue value={record.deltaPositive.sevenDayAvg} precision={2}/>
                            </td>
                        </tr>
                    )
                })
            }</tbody>
        </table>;
    }

    function highlightRegion(region) {
        setHover(region)
    }
    function showRegion(region) {
        let row = document.getElementById(`table_row_${region}`)
        scrollIntoView(row, {scrollMode: 'if-needed', block: 'center'})
    }
    return <div className='GrowthRanking' style={{height: props.height - 30}}>
        <div className='verticalScroll' style={{overflowY: 'auto'}}>{renderTable()}</div>
        <div className='fixed'>
            <GrowthLegend classifications={PositiveGrowthClassifier.classifications()} />
            <DownloadedMap
                mapURI={props.regionSpec.mapURI}
                classNamesProvider={
                    (region) => {
                        let classNames = [categoryByRegion[region]];
                        if (region === hover) {
                            classNames.push('hover')
                        }
                        return  classNames
                    }
                }
                onHover={highlightRegion}
                onRegionSelected={showRegion}
            />
        </div>
    </div>
}