import Per100KRanker from "./per_100k_ranker";
import GrowthRateRanker from "./growth_rate_ranker";

export const RANKERS = [
    new GrowthRateRanker(),
    new Per100KRanker()
]