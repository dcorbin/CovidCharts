import {unique} from "../util/unique";
import {compare_records_by_date} from "../util/date_comparison";

function assessQualityForState(records, propertyNames, context) {
    function assessQualityForProperty(orderedRecords, propertyName) {
        function findStreak(array, record) {
            array = [...array]
            let isNotNull = record[propertyName] !== null;
            if (array.length === 0) {
                return [isNotNull]
            }
            if (array[array.length - 1] !== isNotNull) {
                array.push(isNotNull)
            }
            return array
        }
        let result = {
            "continuous": false,
            "validDataStartingAt": null,
        }
        let firstNonNullIndex = orderedRecords.findIndex(r => r[propertyName] !== null)
        if (firstNonNullIndex < 0) {
            return result
        }
        result.validDataStartingAt = records[firstNonNullIndex].date
        if (firstNonNullIndex >= 0) {
            let validDataStreaks = orderedRecords.reduce(findStreak, [])
            if (validDataStreaks[0] === false) {
                validDataStreaks.shift()
            }
            result.continuous = validDataStreaks.length === 1
            // if (validDataStreaks.length > 1) {
            //     console.log(`${context}, PROPERTY=${propertyName}: ${validDataStreaks.length}`)
            // }
        }

        return result
    }
    const orderedRecords = records.sort(compare_records_by_date)
    let assessment = new Map()
    propertyNames.forEach(propertyName => {
        assessment.set(propertyName, assessQualityForProperty(orderedRecords, propertyName))
    })
    return assessment
}

export default class DataQualityAssessor {
    constructor(propertyNames) {
        this.propertyNames = propertyNames
    }
    assessQuality(records) {
        let states = unique(records.map(r => r.state)).sort()
        let result = new Map()
        states.forEach(state => {
            let stateQuality = assessQualityForState(records.filter(r => r.state === state), this.propertyNames, `STATE=${state}`);
            result.set(state, stateQuality)
        })
        return result
    }
}