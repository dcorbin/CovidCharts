import {unique} from "../util/unique";
import {datesAreEqual} from "../util/date_comparison";

export default class Aggregator {
    constructor(propertyNames) {
        this.propertyNames = propertyNames
    }
    aggregate(records) {
        return unique(records.map(r => r.date), datesAreEqual).map(date => {
            function addRecords(accumulator, currentValue, propertyNames) {
                function addValue(parent, accumulator, currentValue, property) {
                    function isNumber(n) {
                        return !(typeof n === 'undefined' || n == null || isNaN(n))
                    }

                    if (!isNumber(accumulator[property])) {
                        parent[property] = currentValue[property]
                        return
                    }

                    if (isNumber(accumulator[property]) && isNumber(currentValue[property])) {
                        parent[property] = accumulator[property] + currentValue[property]
                    } else {
                        parent[property] = accumulator[property]
                    }
                }

                let result = {
                    date: date
                }
                this.propertyNames.forEach(property =>
                    addValue(result, accumulator, currentValue, property)
                )

                return result
            }

            let zero = {}
            return records.filter(r => datesAreEqual(r.date, date)).reduce(addRecords.bind(this), zero)
        })
    }
}