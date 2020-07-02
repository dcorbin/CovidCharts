import propertyMapper from "../../util/property_mapper";
import {createMappingComparator} from "../../util/comparator";
import Per100KClassifier from "./per100k_classifier";
import {NEW_YORK_REF_PER100k} from "./region_trend_calculator";
import compareTrendPercentage from "./compare_trend_percentge";
import PositiveGrowthClassifier from "./postiive_growth_classirifer";

class Ranker{
    constructor(id, keyPropertyName, label, valueComparator, classifier, explanation = null) {
        this.key = id
        this.label = label
        this.keyPropertyExtractor = propertyMapper((keyPropertyName))
        this.comparator = createMappingComparator(this.keyPropertyExtractor, valueComparator)
        this.classifier = classifier
        this.explanation = explanation
    }
}
class Per100KRanker extends  Ranker {
    constructor() {
        super("per100k", "deltaPositive.perCapitaRelatedToNY", "Per 100 K",(a,b) => {
            if (a === b) return 0
            if (isNaN(a)) return -1
            if (a === null) {
                return -1
            }
            if (b === null) {
                return 1
            }
            return a-b
        }, new Per100KClassifier(), "On 2020-Apr-10 New York state, the worst hot-spot in the US at the time, had it's peak growth in new cases -- " +
            NEW_YORK_REF_PER100k.toFixed(2) + '.  Regions are categorized relative to this value, referred to as 1 NY.' )
    }
}
class RateRanker extends  Ranker {
    constructor() {
        super("rate", "deltaPositive.percentage", "Growth over 7 days",  compareTrendPercentage,
            new PositiveGrowthClassifier())
        this.key = 'rate'
        this.keyPropertyExtractor = propertyMapper("deltaPositive.percentage")
        this.classifier = new PositiveGrowthClassifier()
        this.comparator = createMappingComparator(this.keyPropertyExtractor, compareTrendPercentage)
        this.label = "Growth over 7 days"
    }
}
export const RANKERS = [
    new RateRanker(),
    new Per100KRanker()
]