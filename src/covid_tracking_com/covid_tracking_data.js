import {COVID_TRACKING_PROPERTIES} from "./covid_tracking_com";
import DataQualityAssessor from "./data_quality_assessor";

export default class CovidTrackingData {
    constructor(covidTrackingRecords) {
        this.records = covidTrackingRecords
        this.dataSeriesQualityByRegion = new DataQualityAssessor(COVID_TRACKING_PROPERTIES).
            assessQuality(covidTrackingRecords)
    }

    hasValidData(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).validDataStartingAt !== null
    }
    isContinuous(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).continuous
    }
}
