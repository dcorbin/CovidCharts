import {unique} from "../util/unique";
import {compare_dates, datesAreEqual} from "../util/date_comparison";

export default class Aggregator {
    constructor(propertyNames) {
        this.propertyNames = propertyNames
    }
    aggregate(records) {
        let propertyNames = this.propertyNames
        let dates = unique(records.map(r => r.date), datesAreEqual);
        let orderedDates = dates.sort(compare_dates);
        return orderedDates.map(date => {
            function addRecords(accumulator, currentValue) {
                function addValue(parent, accumulator, currentValue, property) {
                    let a = accumulator[property];
                    let cv = currentValue[property];
                    if (typeof cv === 'undefined') {
                        throw new Error("'" + property + "' is undefined in one or more records.")
                    }
                    let result = null;
                    if (a !== null && cv !== null)
                        result = a + cv;
                    parent[property] = result
                }

                let result = {
                    date: date
                }

                propertyNames.forEach(property =>
                    addValue(result, accumulator, currentValue, property)
                )

                return result
            }

            let zero = {}
            this.propertyNames.forEach(p => zero[p] = 0)
            return records.filter(r => datesAreEqual(r.date, date)).reduce(addRecords.bind(this), zero)
        })
    }
}