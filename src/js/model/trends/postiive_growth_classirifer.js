import {createMappingComparator} from "../../util/comparator";
import Classification from "../../react/model/classification";

const CLASSIFICATIONS = [
    new Classification("dataOddity", "Data Anomaly", p => (isNaN(p) || p === null), 12),
    new Classification("bad3", ">= 100%", p => p >= 100, 1),
    new Classification("bad2", "50 - 100%", p => p >= 50, 2),
    new Classification("bad1", "10 - 50%", p => p >= 10, 3),
    new Classification("neutral", "-10 - 10%", p => p > -10, 4),
    new Classification("good1", "-50 - -10%", p => p > -50, 5),
    new Classification("good2", "-100 - -50%", p => p > -100, 6),
    new Classification("good3", "All Clear", p => (p === -100), 7),
    new Classification("notApplicable", "N/A", p =>  p === -Infinity, 10),
]

export default class PositiveGrowthClassifier {
    classifications() {
        return [...CLASSIFICATIONS].sort(createMappingComparator(p => p.displayOrder))
    }
    categoryClassName(percentage, region='Unspecified') {
        let classification = CLASSIFICATIONS.find(c => c.requirement(percentage))
        if (!classification)
        {
            console.log("Unable to classify " + percentage)
            return ''
        }
        return classification.className;
    }


}