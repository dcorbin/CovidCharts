import {PopupActivatingButton} from "../../react/basic/popup/popup_activating_button";
import ChartIcon from "../../react/basic/chart_icon/chart_icon";
import TrendPercentage from "../../react/growth_ranking/trend_percentage";
import TrendValue from "../../react/growth_ranking/trend_value";
import PropTypes from "prop-types";
import React from "react";
import PROP_TYPES from "../../react/model/prop_types";
import './ranking_table.css'
import {RANKERS} from "./rankers/rankers";
RankingTable.defaultProps = {
    onHover: () => {},
    mostRecentDate: ''
}
RankingTable.propTypes = {
    records: PropTypes.arrayOf(PropTypes.object).isRequired,
    categoryByRegion: PropTypes.instanceOf(Map).isRequired,
    mostRecentDate: PropTypes.string,
    onHover: PropTypes.func,
    hoverRegion: PropTypes.string,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
    renderChartFor: PropTypes.func.isRequired,
}
export default function RankingTable(props) {
    return <table className='RankingTable'>
        <thead>
        <tr className='row'>
            <th className='cell'> </th>
            <th colSpan="3" className='cell'>Positivity (7-day Avg) through {props.mostRecentDate}</th>
        </tr>
        <tr className='row'>
            <th className='cell'>{props.regionSpec.singleNoun.charAt(0).toUpperCase()}{props.regionSpec.singleNoun.substr(1)}</th>
            <th className='cell'>{RANKERS[0].label}</th>
            <th className='cell'>New cases</th>
            <th className='cell'>{RANKERS[2].label}</th>
        </tr>
        </thead>
        <tbody>
        {
            props.records.map(record => {
                let category = props.categoryByRegion.get(record.region)
                let rowClassNames = ['row']
                if (record.region === props.hoverRegion) {
                    rowClassNames.push('hover')
                }
                return (
                    <tr key={record.region}
                        id={`table_row_${record.region}`}
                        onMouseEnter={() => props.onHover(record.region)}
                        onMouseLeave={() => props.onHover(null)}
                        className={rowClassNames.join(' ')}>
                        <td className={`cell growthRegion`}>
                            <PopupActivatingButton
                                popupContent={() => props.renderChartFor(record.region)}
                                linkContent={() => <ChartIcon/>}/>
                            {props.regionSpec.displayNameFor(record.region)}
                        </td>
                        <td className={`cell number percentage ${category}`}>
                            <TrendPercentage value={record.deltaPositive.percentage}/>
                        </td>
                        <td className={`cell number value ${category}`}>
                            <TrendValue value={record.deltaPositive.sevenDayAvg} precision={2}/>
                        </td>
                        <td className={`cell number value ${category}`}>
                            <TrendValue value={record.deltaPositive.newCasesPer100k} NaN='N/A' precision={1} />
                        </td>
                    </tr>
                )
            })
        }</tbody>
    </table>;
}
