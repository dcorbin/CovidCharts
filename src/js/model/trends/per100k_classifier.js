import {createMappingComparator} from "../../util/comparator";
import Classification from "../../react/model/classification";

const CLASSIFICATIONS = [
    new Classification("good3", "0 - 1", p => p < 1, 1),
    new Classification("good2", "1 - 2", p => p < 2, 2),
    new Classification("good1", "2 - 4", p => p < 4, 3),
    new Classification("neutral", "4 - 8", p => p < 8, 4),
    new Classification("bad1", "8 - 16", p => p < 16, 5),
    new Classification("bad2", "16 - 32", p => p < 32, 6),
    new Classification("bad3", ">= 32", p => true, 7),
]

export default class Per100KClassifier {
    classifications() {
        return [...CLASSIFICATIONS].sort(createMappingComparator(p => p.displayOrder))
    }
    categoryClassName(value, region='Unspecified') {
        let classification = CLASSIFICATIONS.find(c => c.requirement(value))
        if (!classification)
        {
            console.log("Unable to classify " + value)
            return ''
        }
        return classification.className;
    }


}