import DataQualityAssessor from "./data_quality_assessor";
import {unique} from "../util/unique";
import React from "react";

class Warning {
    static noHospitalization() {
        return new Warning('noHosp', null)
    }
    static brokenDataLines(brokenProperties) {
        return new Warning('broken', brokenProperties)
    }
    constructor(type, renderingDetails) {
        this.type = type
        this.renderingDetails = renderingDetails
    }
}

export var STANDARD_DATA_PROPERTIES = ['death', 'hospitalized', 'positive']

export default class NormalizedRecordSet {
    constructor(records) {
        this.records = records
        this.dataSeriesQualityByRegion = new DataQualityAssessor(STANDARD_DATA_PROPERTIES).
            assessQuality(records)
        this.regions = unique(this.records.map(record => record.region).sort())
        this.warningsByRegion = buildWarningsByRegion(this)
    }

    isEmpty() {
        return this.records.length === 0
    }

    hasValidData(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).validDataStartingAt !== null
    }

    isContinuous(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).continuous
    }

    hasWarning(type) {
        return this.warningTypes().includes(type)
    }
    warningsFor(region) {
        return  this.warningsByRegion.get(region)
    }

    warningTypes () {
        let warnings = Array.from(this.warningsByRegion.values());
        return unique(warnings.flat().map(w => w.type));
    };

}
