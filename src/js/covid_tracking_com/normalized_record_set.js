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


function buildWarningsByRegion(recordSet) {
    function calculateDataSeriesWarningsFor(region) {
        let warnings = []
        let hasHospitalizationData = recordSet.hasValidData(region, 'hospitalized');
        if (!hasHospitalizationData) {
            warnings.push(Warning.noHospitalization())
        }
        let brokenProperties = []
        STANDARD_DATA_PROPERTIES.forEach(propertyName => {
            if (!recordSet.isContinuous(region, propertyName)) {
                if (hasHospitalizationData || propertyName !== 'hospitalized')
                    brokenProperties.push(propertyDisplay(propertyName))
            }
        })
        if (brokenProperties.length > 0) {
            warnings.push(Warning.brokenDataLines(brokenProperties))
        }
        return warnings
    }
    let warningsByRegion = new Map()
    recordSet.regions.forEach(region => {
        return warningsByRegion.set(region, calculateDataSeriesWarningsFor(region));
    })
    return new WarningsByRegion(warningsByRegion)
}
class WarningsByRegion {
    constructor(warningsByRegion) {
        this.warningsByRegion = warningsByRegion
        this.regions = [...warningsByRegion.keys()]
    }

    warningsFor(region) {
        return  this.warningsByRegion.get(region)
    }

    warningTypes () {
        let warnings = Array.from(this.warningsByRegion.values());
        return unique(warnings.flat().map(w => w.type));
    };

}
export default class NormalizedRecordSet {
    static forError(message) {
        return new NormalizedRecordSet([], message)
    }
    static empty() {
        return new NormalizedRecordSet([])
    }
    constructor(records, error = null) {
        this.error = error
        this.records = records
        this.dataSeriesQualityByRegion = new DataQualityAssessor(STANDARD_DATA_PROPERTIES).
            assessQuality(records)
        this.regions = unique(this.records.map(record => record.region).sort())
        this.warningsByRegion = buildWarningsByRegion(this)
        if (records.length === 0) {
            this._mostRecentDate = null
        } else {
            let values = records.map(r => r.date.getTime());

            console.log("Record Count: " + values.length)
            if (values.length === 0) {
                this._mostRecentDate = null
            } else {
                // calculate max for very large array -- I've been getting an error do the data volume with math.max(...values)
                let mostRecent = 0
                values.forEach(function(v) {
                    if (v > mostRecent) {
                        mostRecent = v
                    }
                })
                this._mostRecentDate = new Date(mostRecent)
            }
        }
    }
    mostRecentDate() {
        return this._mostRecentDate
    }

    isEmpty() {
        return this.records.length === 0
    }

    hasValidData(region, propertyName) {
        let regionData = this.dataSeriesQualityByRegion.get(region);
        if (!regionData) {
            console.log(`WARNING: hasValidData(${region}, ${propertyName}) -> false`)
            return false
        }
        return regionData.get(propertyName).validDataStartingAt !== null
    }

    isContinuous(region, propertyName) {
        return this.dataSeriesQualityByRegion.get(region).get(propertyName).continuous
    }

    hasWarning(type) {
        return this.warningsByRegion.warningTypes().includes(type)
    }
}

export var STANDARD_DATA_PROPERTIES = ['death', 'hospitalized', 'positive']

export function propertyDisplay(property) {
    if (property === 'hospitalized') {
        return 'Hospitalizations'
    }
    if (property === 'death') {
        return 'Deaths'
    }
    if (property === 'positive') {
        return 'Positives'
    }
    return "Unknown"
}