import {StateRegionSpec} from "../../subject/us/states";
import {CountyRegionSpec} from "../../subject/georgia/county_spec";
import React from "react";
import ReadThroughCache from "../../util/read_thru_cache";
import CovidTrackingCom from "../../covid_tracking_com/covid_tracking_com";
import Clock from "../../util/clock";
import GeorgiaByCounty from "../../subject/georgia/GeorgiaByCounty";
import UsaPopulationLoader from "../../population/usa_population_loader";
import GaPopulationLoader from "../../population/ga_population_loader";

class DataFocus {
    constructor(name, key, regionSpec, dataProvider,
                populationLoader,
                settingsKey,
                footerLink, footerText) {
        this.name = name
        this.key = key
        this.regionSpec = regionSpec
        this.dataProvider = dataProvider
        this.settingsKey = settingsKey
        this.populationLoader = populationLoader
        this.footerLink = footerLink
        this.footerText = footerText
    }
}

export function dataFocusFromKey(key) {
    return DATA_FOCUS_LIST.find(s => s.key === key)
}

let COVID_CACHE_DURATION = 1000 * 60 * 60;
let POPULATION_CACHE_DURATION = 1000 * 60 * 60 * 24 * 30;
let clock = new Clock();
const DATA_FOCUS_LIST = [
    new DataFocus('United\u00a0States',
        'covidTracking.com',
        new StateRegionSpec(),
        new ReadThroughCache(COVID_CACHE_DURATION, clock, new CovidTrackingCom()),
        new ReadThroughCache(POPULATION_CACHE_DURATION, clock, new UsaPopulationLoader()),
        'covidTracking',
        "https://covidtracking.com",
        "covidtracking.com"
        ),
    new DataFocus('Georgia',
        'georgia-dph',
        new CountyRegionSpec(),
        new ReadThroughCache(COVID_CACHE_DURATION, clock, new GeorgiaByCounty()),
        new ReadThroughCache(POPULATION_CACHE_DURATION, clock, new GaPopulationLoader()),
            'georgia',
            "https://dph.georgia.gov/covid-19-daily-status-report",
            "Georgia Department of Public Health"

    ),
]
export default DATA_FOCUS_LIST