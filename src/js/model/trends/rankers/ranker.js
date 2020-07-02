import propertyMapper from "../../../util/property_mapper";
import {createMappingComparator} from "../../../util/comparator";

export default class Ranker {
    constructor(id, keyPropertyName, label, valueComparator, classifier, explanation = null) {
        this.key = id
        this.label = label
        this.keyPropertyExtractor = propertyMapper((keyPropertyName))
        this.comparator = createMappingComparator(this.keyPropertyExtractor, valueComparator)
        this.classifier = classifier
        this.explanation = explanation
    }

    categoryClassName(record) {
        return this.classifier.categoryClassName(this.keyPropertyExtractor(record))
    }

    classifications() {
        return this.classifier.classifications()
    }
}