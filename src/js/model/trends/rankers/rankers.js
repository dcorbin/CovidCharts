import Per100KRanker from "./per_100k_ranker";
import GrowthRateRanker from "./growth_rate_ranker";
import NewCaseCountRanker from "./new_cases_ranker";

export const RANKERS = [
    new GrowthRateRanker(),
    new NewCaseCountRanker(),
    new Per100KRanker()
]