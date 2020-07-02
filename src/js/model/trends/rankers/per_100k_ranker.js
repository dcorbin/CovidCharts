import {NEW_YORK_REF_PER100k} from "../region_trend_calculator";
import Classification from "../../../react/model/classification";
import {createMappingComparator} from "../../../util/comparator";
import Ranker from "./ranker";

const CLASSIFICATIONS = [
    new Classification("dataOddity", "Data Anomaly", p => p < 0, 12),
    new Classification("notApplicable", "N/A", p => isNaN(p), 10),
    new Classification("allClear", "All Clear", p => p === 0, 9),
    new Classification("good3", " < ¼ NY", p => p < 25, 8),
    new Classification("good2", "¼ - ½ NY", p => p < 50, 7),
    new Classification("good1", "½ - 1 NY", p => p < 100, 6),
    new Classification("bad1", "1 - 2 NY", p => p < 200, 5),
    new Classification("bad2", "2 - 4 NY", p => p < 400, 4),
    new Classification("bad3", ">= 4 NY", p => true, 3),
]


class Per100KClassifier {

    classifications() {
        return [...CLASSIFICATIONS].sort(createMappingComparator(p => p.displayOrder))
    }
    categoryClassName(value, region='Unspecified') {
        if (isNaN(value)) {
            return "notApplicable"
        }
        let classification = CLASSIFICATIONS.find(c => c.requirement(value))
        if (!classification)
        {
            console.log("Unable to classify " + value)
            return ''
        }
        return classification.className;
    }
}

export default class Per100KRanker extends Ranker {
    constructor() {
        super("per100k", "deltaPositive.perCapitaRelatedToNY", "per 100,000", (a, b) => {
            if (a === b) return 0
            if (isNaN(a)) return -1
            if (a === null) {
                return -1
            }
            if (b === null) {
                return 1
            }
            return a - b
        }, new Per100KClassifier(), "On 2020-Apr-10 New York state, the worst hot-spot in the US at the time, had it's peak growth in new cases -- " +
            NEW_YORK_REF_PER100k.toFixed(2) + '.  Regions are categorized relative to this value, referred to as 1 NY.')
    }
}
