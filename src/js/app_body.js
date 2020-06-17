import ChartPanel from "./react/chart_panel";
import Footer from "./react/footer";
import React from "react";
import PROP_TYPES from "./react/model/prop_types";
import PropTypes from 'prop-types'
import 'react-tabs/style/react-tabs.css';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import GrowthRanking from "./react/growth_ranking";

AppBody.propTypes = {
    dataSource: PROP_TYPES.DataSource,
    recordSet: PROP_TYPES.NormalizedRecordSet.isRequired,
    dataSourceSettings: PROP_TYPES.DataSourceSettings.isRequired,
    onSettingsChange: PropTypes.func.isRequired
}

export default function AppBody(props) {
    function handleTabChange(index) {
        props.onSettingsChange({...props.dataSourceSettings, activeTab: index})
        return true
    }
    let dataSource = props.dataSource
    if (!dataSource)
        return <p>Please select a dataSource.</p>

    return <div className='AppBody'>
        <Tabs onSelect={handleTabChange} selectedIndex={props.dataSourceSettings.activeTab}>
            <TabList>
                <Tab>Charting</Tab>
                <Tab>Growth Rankings</Tab>
            </TabList>

            <TabPanel>
                <ChartPanel
                    recordSet={props.recordSet}
                    regionSpec={dataSource.regionSpec}
                    settings={props.dataSourceSettings}
                    onSettingsChange={props.onSettingsChange}/>
            </TabPanel>
            <TabPanel>
                <GrowthRanking
                    recordSet={props.recordSet}
                    regionSpec={dataSource.regionSpec}
                />
            </TabPanel>
        </Tabs>

        <Footer source={<a href={dataSource.footerLink}>{dataSource.footerText}</a>}/>
    </div>;
}