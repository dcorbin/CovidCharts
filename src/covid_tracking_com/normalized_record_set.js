import DataQualityAssessor from "./data_quality_assessor";
import {unique} from "../util/unique";

export var STANDARD_DATA_PROPERTIES = ['death', 'hospitalized', 'positive']

export default class NormalizedRecordSet {
    constructor(records) {
        this.records = records
        this.dataSeriesQualityByRegion = new DataQualityAssessor(STANDARD_DATA_PROPERTIES).
            assessQuality(records)
        this.regions = unique(this.records.map(record => record.region).sort())
    }

    hasValidData(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).validDataStartingAt !== null
    }
    isContinuous(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).continuous
    }
}
