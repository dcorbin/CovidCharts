import {compare_records_by_date} from "../util/date_comparison";
import {unique} from "../util/unique";

export default class LeadingNullAsZeroConverter {
    constructor(propertyNames) {
        this.propertyNames = propertyNames
    }
    convert(records) {
        let states = unique(records.map(r => r.state)).sort()
        let result = states.map(s => {
            let inLeadingNullRunByProperty = new Map(this.propertyNames.map(p => [p, true]))
            let sortedStateRecords = records.filter(r => r.state === s).sort(compare_records_by_date);
            return sortedStateRecords.map(r => {
                let result = {...r}
                this.propertyNames.forEach(p => {
                    if (inLeadingNullRunByProperty.get(p)) {
                        if (r[p] === null) {
                            result[p] = 0
                        } else {
                            inLeadingNullRunByProperty.set(p, false)
                        }

                    }
                })
                return result
            })

        })
        return result.flat()
    }
}