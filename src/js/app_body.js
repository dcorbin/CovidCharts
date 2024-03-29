import ChartPanel from "./react/chart_panel";
import Footer from "./react/footer";
import React from "react";
import PROP_TYPES from "./react/model/prop_types";
import PropTypes from 'prop-types'
import 'react-tabs/style/react-tabs.css';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import GrowthRanking from "./react/growth_ranking/growth_ranking";
import './app_body.css'
import {ErrorBoundary} from "react-error-boundary";
import ErrorBlock from "./react/basic/error_block";

AppBody.propTypes = {
    height: PropTypes.number.isRequired,
    dataFocus: PROP_TYPES.DataFocus,
    recordSet: PROP_TYPES.NormalizedRecordSet.isRequired,
    dataFocusSettings: PROP_TYPES.DataFocusSettings.isRequired,
    onSettingsChange: PropTypes.func.isRequired
}

export default function AppBody(props) {
    function handleTabChange(index) {
        props.onSettingsChange({...props.dataFocusSettings, activeTab: index})
        return true
    }
    function renderTabs() {
        return <Tabs onSelect={handleTabChange} selectedIndex={props.dataFocusSettings.activeTab}>
            <TabList>
                <Tab>Charting</Tab>
                <Tab>Growth Rankings</Tab>
            </TabList>

            <TabPanel>
                <ErrorBoundary FallbackComponent={ErrorBlock.callback}>
                    <div style={{height: props.height - tabHeight}}>
                        <ChartPanel
                            recordSet={props.recordSet}
                            regionSpec={dataFocus.regionSpec}
                            settings={props.dataFocusSettings}
                            onSettingsChange={props.onSettingsChange}/>
                    </div>
                </ErrorBoundary>
            </TabPanel>
            <TabPanel>
                <ErrorBoundary FallbackComponent={ErrorBlock.callback}>
                    <GrowthRanking
                        populationMap={props.dataFocus.populationMap}
                        height={props.height - tabHeight}
                        recordSet={props.recordSet}
                        regionSpec={dataFocus.regionSpec}
                        settings={props.dataFocusSettings}
                        onSettingsChange={props.onSettingsChange}/>
                </ErrorBoundary>
            </TabPanel>
        </Tabs>;
    }

    function renderVerticalScrollingTabs() {
        return <div className="VerticalScroller" style={{height: `${props.height}px`}}>
            {renderTabs()}
        </div>;
    }

    let dataFocus = props.dataFocus
    if (!dataFocus)
        return <p>Please select a Data Focus.</p>

    let tabHeight = 35;


    return (
        <div className='AppBody'>
            {props.height ? renderVerticalScrollingTabs() : renderTabs()}
            <Footer source={<a href={dataFocus.footerLink}>{dataFocus.footerText}</a>}/>
        </div>)
}