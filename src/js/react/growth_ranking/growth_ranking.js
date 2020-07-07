import React, {useState} from "react";
import PropTypes from "prop-types";
import PROP_TYPES from "../model/prop_types";
import {TrendAnalyzer} from "../../model/trends/trend_analyzer";
import './growth_ranking.css'
import './growth_ranking_colors.css'
import DownloadedMap from "../maps/downloaded_map";
import scrollIntoView from "scroll-into-view-if-needed";
import GrowthLegend from "./growth_legend";
import ChartPanel from "../chart_panel";
import {Settings} from "../../settings";
import ControlPanelDropDown from "../control_panel_drop_down";
import {createReverseComparator} from "../../util/comparator";
import {RANKERS} from "../../model/trends/rankers/rankers";
import RankingTable from "../../model/trends/ranking_table";
import ErrorBlock from "../basic/error_block";
import {ErrorBoundary} from "react-error-boundary";
import {TabPanel} from "react-tabs";

GrowthRanking.propTypes = {
    height: PropTypes.number.isRequired,
    recordSet: PropTypes.object.isRequired,
    populationMap: PropTypes.instanceOf(Map).isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
    settings: PROP_TYPES.DataFocusSettings.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
}

export default function GrowthRanking(props) {
    function findMostRecentDate() {
        let mostRecentDate = props.recordSet.mostRecentDate()
        if (mostRecentDate !== null) {
            const dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: '2-digit'})
            const [{value: month}, , {value: day}, ,] = dateTimeFormat.formatToParts(mostRecentDate)
            mostRecentDate = `${month}-${day}`
        } else {
            mostRecentDate = 'N/A'
        }
        return mostRecentDate;
    }

    function renderChartFor(region) {
        let settings = Settings.defaultFocusSettings([region])
        return <div style={{padding: '20px', boxSizing: 'border-box', width: '100%', height: '100%'}}>
            <ChartPanel settings={settings}
                        showControlPanel={false}
                        regionSpec={props.regionSpec}
                        recordSet={props.recordSet}/>
        </div>
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
            <div className='mainPanel' style={{height: props.height - 30 - 34}}>
                <div className='verticalScroll' style={{overflowY: 'auto'}}>
                    <RankingTable records={scoredRegions}
                                   categoryByRegion={categoryByRegion}
                                   onHover={highlightRegion}
                                   hoverRegion={hover}
                                   regionSpec={props.regionSpec}
                                   mostRecentDate={findMostRecentDate()}
                                   renderChartFor={renderChartFor}/>
                </div>
                <div className='fixed'>
                    <ErrorBoundary FallbackComponent={ErrorBlock.callback}>
                        <GrowthLegend classifications={ranker.classifications()}
                                      infoBlock={ranker.explanation}
                                      countForClassificationName={(name) => {
                                          return String(Array.from(categoryByRegion.values()).
                                            filter(category => category === name).length)
                                      }}/>
                    </ErrorBoundary>
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
    if (!ranker) {
        ranker = RANKERS[0]
    }

    let scoredRegions = new TrendAnalyzer().calculateTrendsForAllRegions(props.recordSet.records, props.populationMap).
        sort(createReverseComparator(ranker.comparator));
    let categoryByRegion = scoredRegions.reduce((result, record) => {
        let className = ranker.categoryClassName(record)
        result.set(record.region,className);
        return result
    }, new Map())

    return (
        <div className='GrowthRanking'>
             <div className='ControlPanel'>
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