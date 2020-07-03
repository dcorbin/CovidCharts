import Ranker from "./ranker";
import Classification from "../../../react/model/classification";
import {createMappingComparator} from "../../../util/comparator";

const NEW_YORK_SEVEN_DAY_AVG_PEAK =  9664.143

const CLASSIFICATIONS = [
    new Classification("dataOddity", "Data Anomaly", p => p < 0, 12),
    new Classification("notApplicable", "N/A", p => isNaN(p), 10),
    new Classification("allClear", "All Clear", p => p === 0, 9),
    new Classification("good3", " < 10", p => p < 10, 8),
    new Classification("good2", "10 - 100", p => p < 100, 7),
    new Classification("good1", "100 - 1,000", p => p < 1000, 6),
    new Classification("bad1", "1,000 - 10,000", p => p < 10000, 5),
    new Classification("bad2", "10,0000 - 100,000", p => p < 100000, 4),
    new Classification("bad3", ">= 1000,000", p => true, 3),
]
export default class NewCaseCountRanker extends Ranker {
    constructor() {
        super("newCaseCount", "deltaPositive.sevenDayAvg", "New cases",
            (a, b) => {
            if (a === b) return 0
            if (isNaN(a)) return -1
            if (a === null) {
                return -1
            }
            if (b === null) {
                return 1
            }
            return a - b
        }, null)
    }
    categoryClassName(record) {
        let value = this.keyPropertyExtractor(record)
        let classification = CLASSIFICATIONS.find(c => c.requirement(value))
        if (!classification)
        {
            console.log("Unable to classify " + value)
            return ''
        }
        return classification.className;
    }
    classifications() {
        return [...CLASSIFICATIONS].sort(createMappingComparator(p => p.displayOrder))
    }
    //

}
