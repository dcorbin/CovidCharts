import {unique} from "../../util/unique";
import {compare_records_by_date} from "../../util/date_comparison";
import DeltaDecorator from "../../covid_tracking_com/delta_decorator";
import NDayAverageDecorator from "../../covid_tracking_com/n_day_avg_decorator";
import BoundaryFinder from "./boundary_finder";
import RegionTrendCalculator from "./region_trend_calculator";
import {createMappingComparator, createReverseComparator} from "../../util/comparator";


export function compareTrendPercentage(a, b) {
    if (a === null) {
        if (b === null) {
            return 0
        }
        return -1
    }
    if (b === null) {
        return 1
    }
    if (a < b) {
        return -1
    }
    if (a > b) {
        return 1
    }
    return 0;
}
export class TrendAnalyzer {
    constructor() {
        this.propertyNames =  ["deltaPositive", "deltaDeath", "deltaHospitalized"]
    }
    calculateTrendsForAllRegions(records) {
        let regions = unique(records.map(r => r.region))

        function createMapper(propertyName) {
            return (record) => record[propertyName].percentage;
        }

        function rankRecords(regions, records, propertyNames) {
            return regions.map(region => {
                let regionRecords = records.filter(r => r.region === region).sort(compare_records_by_date)
                let dataToAnalyze = new DeltaDecorator().decorate(regionRecords)
                dataToAnalyze = new NDayAverageDecorator().decorate(dataToAnalyze, 7)

                let boundaryRecords = new BoundaryFinder(7).findBoundaryRecords(dataToAnalyze)
                let result = {region: region}
                propertyNames.forEach(name => {
                    result[name] = new RegionTrendCalculator().calculateTrend(boundaryRecords, name)
                })

                return result
            });
        }

        let rankingRecords = rankRecords(regions, records, this.propertyNames);
        let mapper = createMapper(this.propertyNames[0])
        let comparator = createReverseComparator(
            createMappingComparator(mapper,
                compareTrendPercentage));
        return rankingRecords.sort(comparator)
    }

}