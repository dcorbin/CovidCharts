import {StateRegionSpec} from "../../subject/us/states";
import {CountyRegionSpec} from "../../subject/georgia/county_spec";
import React from "react";
import ReadThroughCache from "../../util/read_thru_cache";
import CovidTrackingCom from "../../covid_tracking_com/covid_tracking_com";
import Clock from "../../util/clock";
import GeorgiaByCounty from "../../subject/georgia/GeorgiaByCounty";

class DataFocus {
    constructor(name, key, regionSpec, dataProvider, settingsKey, footerLink, footerText) {
        this.name = name
        this.key = key
        this.regionSpec = regionSpec
        this.dataProvider = dataProvider
        this.settingsKey = settingsKey
        this.footerLink = footerLink
        this.footerText = footerText
    }
}

export function dataFocusFromKey(key) {
    return DATA_FOCUS_LIST.find(s => s.key === key)
}


const DATA_FOCUS_LIST = [
    new DataFocus('United\u00a0States',
        'covidTracking.com',
        new StateRegionSpec(),
        new ReadThroughCache(1000 * 60 * 60, new Clock(), new CovidTrackingCom()),
        'covidTracking',
        "https://covidtracking.com",
        "covidtracking.com"
        ),
    new DataFocus('Georgia',
        'georgia-dph',
        new CountyRegionSpec(),
        new ReadThroughCache(1000 * 60 * 60, new Clock(), new GeorgiaByCounty()),
            'georgia',
            "https://dph.georgia.gov/covid-19-daily-status-report",
            "Georgia Department of Public Health"

    ),
]
export default DATA_FOCUS_LIST