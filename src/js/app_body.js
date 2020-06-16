import ChartPanel from "./react/chart_panel";
import Footer from "./react/footer";
import React from "react";
import PROP_TYPES from "./react/model/prop_types";
import PropTypes from 'prop-types'

AppBody.propTypes = {
    dataSource: PROP_TYPES.DataSource,
    recordSet: PROP_TYPES.NormalizedRecordSet.isRequired,
    dataSourceSettings: PROP_TYPES.DataSourceSettings.isRequired,
    onSettingsChange: PropTypes.func.isRequired
}

export default function AppBody(props) {
    let dataSource = props.dataSource
    if (!dataSource)
        return <p>Please select a dataSource.</p>

    return <div className='body'>
        <ChartPanel
            recordSet={props.recordSet}
            dataProvider={dataSource.dataProvider}
            regionSpec={dataSource.regionSpec}
            settings={props.dataSourceSettings}
            onSettingsChange={props.onSettingsChange}/>
        <Footer source={<a href={dataSource.footerLink}>{dataSource.footerText}</a>}/>
    </div>;
}