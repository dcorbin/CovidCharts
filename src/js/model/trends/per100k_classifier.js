import {createMappingComparator} from "../../util/comparator";
import Classification from "../../react/model/classification";
import PositiveGrowthClassifier from "./postiive_growth_classirifer";

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

export default class Per100KClassifier {
    constructor() {
        this.delegate = new PositiveGrowthClassifier()
    }
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