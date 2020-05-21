import {COVID_TRACKING_PROPERTIES} from "./covid_tracking_com";
import DataQualityAssessor from "./data_quality_assessor";

export default class CovidTrackingData {
    constructor(covidTrackingRecords) {
        this.records = covidTrackingRecords
        this.dataSeriesQualityByState = new DataQualityAssessor(COVID_TRACKING_PROPERTIES).assessQuality(covidTrackingRecords)
    }

    hasValidData(state, propertyName) {
        return this.dataSeriesQualityByState.get(state).get(propertyName).validDataStartingAt !== null
    }
}
