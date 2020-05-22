import DataQualityAssessor from "./data_quality_assessor";

export var STANDARD_DATA_PROPERTIES = ['death', 'hospitalized', 'positive']

export default class NormalizedRecordSet {
    constructor(covidTrackingRecords) {
        this.records = covidTrackingRecords
        this.dataSeriesQualityByRegion = new DataQualityAssessor(STANDARD_DATA_PROPERTIES).
            assessQuality(covidTrackingRecords)
    }

    hasValidData(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).validDataStartingAt !== null
    }
    isContinuous(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).continuous
    }
}
