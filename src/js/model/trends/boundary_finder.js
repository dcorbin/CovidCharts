import {compare_records_by_date_descending} from "../../util/date_comparison";

export default class BoundaryFinder {
    constructor(spanInDays) {
        this.spanInDays = spanInDays
    }
    findBoundaryRecords(records) {
        let sorted = records.sort(compare_records_by_date_descending)
        let current = sorted[0]
        let cutoff = current.date.getTime() - (1000 * 60 * 60 * 24 * this.spanInDays);
        let past = sorted.find(r => r.date.getTime() <= cutoff)
        return {from: past ? past : null, to: current }
    }
}