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
import ChartPanel from "../chart_panel";
import {Settings} from "../../settings";
import ControlPanelDropDown from "../control_panel_drop_down";
import {createMappingComparator, createReverseComparator} from "../../util/comparator";
import compareTrendPercentage from "../../model/trends/compare_trend_percentge";
import Per100KClassifier from "../../model/trends/per100k_classifier";

GrowthRanking.propTypes = {
    height: PropTypes.number.isRequired,
    recordSet: PropTypes.object.isRequired,
    populationMap: PropTypes.instanceOf(Map).isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
    settings: PROP_TYPES.DataFocusSettings.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
}
function createMapper(propertyName) {
    return (record) => {
        let propertyNames = propertyName.split('.')
        return propertyNames.reduce((total, element) =>  total[element], record)
    };
}
class Per100KRanker {
    constructor() {
        this.keyPropertyExtractor = createMapper("deltaPositive.newCasesPer100k")
        this.label = "Per 100 K"
        this.key = 'per100k'
        this.comparator = createMappingComparator(this.keyPropertyExtractor, (a,b) => {
            if (a === b) return 0
            if (a === null) {
                return -1
            }
            if (b === null) {
                return 1
            }
            return a-b
        })
        this.classifier = new Per100KClassifier()
    }

}
class RateRanker {
    constructor() {
        this.key = 'rate'
        this.keyPropertyExtractor = createMapper("deltaPositive.percentage")
        this.classifier = new PositiveGrowthClassifier()
        this.comparator = createMappingComparator(this.keyPropertyExtractor, compareTrendPercentage)
        this.label = "Growth over 7 days"
    }
}
const RANKERS = [
     new RateRanker(),
     new Per100KRanker()
]

export default function GrowthRanking(props) {
    function findMostRecentDate() {
        let mostRecentDate = props.recordSet.mostRecentDate()
        if (mostRecentDate !== null) {
            const dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: '2-digit'})
            const [{value: month}, , {value: day}, , {value: year}] = dateTimeFormat.formatToParts(mostRecentDate)
            mostRecentDate = `${month}-${day}`
        } else {
            mostRecentDate = 'N/A'
        }
        return mostRecentDate;
    }

    function renderTable() {
        return <table>
            <thead>
            <tr className='row'>
                <th className='cell'> </th>
                <th colSpan="3" className='cell'>Positivity Growth (7-day Avg)</th>
            </tr>
            <tr className='row'>
                <th className='cell'>{props.regionSpec.singleNoun.charAt(0).toUpperCase()}{props.regionSpec.singleNoun.substr(1)}</th>
                <th className='cell'>Growth over<br/>7 days</th>
                <th className='cell'>New cases<br/>{mostRecentDate}</th>
                <th className='cell'>New cases<br/>per 100,000</th>
            </tr>
            </thead>
            <tbody>
            {
                scoredRegions.map(record => {
                    let category = categoryByRegion.get(record.region)
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
                                    popupContent={() => {
                                        let settings = Settings.defaultFocusSettings([record.region])
                                        return <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', height: '100%'}}>
                                            <ChartPanel settings={settings}
                                                           showControlPanel={false}
                                                           regionSpec={props.regionSpec}
                                                                 recordSet={props.recordSet}/>
                                        </div>
                                    }}
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
                               <TrendValue value={record.deltaPositive.newCasesPer100k} infinity='N/A' precision={1} />
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

    function renderMainPanel() {
        return (
            <div className='mainPanel' style={{height: props.height - 30}}>
                <div className='verticalScroll' style={{overflowY: 'auto'}}>{renderTable()}</div>
                <div className='fixed'>
                    <GrowthLegend classifications={ranker.classifier.classifications()}
                                  countForClassificationName={(name) => {
                                      return String(Array.from(categoryByRegion.values()).filter(category => category === name).length)
                                  }}/>
                    <DownloadedMap
                        mapURI={props.regionSpec.mapURI}
                        classNamesProvider={
                            (region) => {
                                let classNames = [categoryByRegion.get(region)];
                                if (region === hover) {
                                    classNames.push('hover')
                                }
                                return classNames
                            }
                        }
                        onHover={highlightRegion}
                        onRegionSelected={showRegion}
                    />
                </div>
            </div>);
    }

    let [hover, setHover] = useState(null)
    let ranker = RANKERS.find(r => r.key === props.settings.ranker)
    let scoredRegions = new TrendAnalyzer().calculateTrendsForAllRegions(props.recordSet.records, props.populationMap).
        sort(createReverseComparator(ranker.comparator));
    let categoryByRegion = scoredRegions.reduce((result, record) => {
        let className = ranker.classifier.categoryClassName(ranker.keyPropertyExtractor(record), record.region);
        result.set(record.region,className);
        return result
    }, new Map())

    let mostRecentDate = findMostRecentDate();
    return (
        <div className='GrowthRanking'>
             <div className='controlPanel'>
                 <ControlPanelDropDown
                     settings={ props.settings }
                     propertyName='ranker'
                     onSettingsChange={
                         (newSettings) => {
                             props.onSettingsChange(newSettings)
                         }
                     }
                     label='Rank and Categorize by' options={
                         RANKERS.map(r => ({value: r.key, label: r.label}))
                     }/>
             </div>
            {renderMainPanel()}
        </div>
    )
}