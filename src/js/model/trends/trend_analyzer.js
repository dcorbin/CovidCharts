import {unique} from "../../util/unique";
import {compare_records_by_date} from "../../util/date_comparison";
import DeltaDecorator from "../../covid_tracking_com/delta_decorator";
import NDayAverageDecorator from "../../covid_tracking_com/n_day_avg_decorator";
import BoundaryFinder from "./boundary_finder";
import RegionTrendCalculator from "./region_trend_calculator";
import {createMappingComparator, createReverseComparator} from "../../util/comparator";



export class TrendAnalyzer {
    constructor() {
        this.propertyNames =  ["deltaPositive", "deltaDeath", "deltaHospitalized"]
    }
    calculateTrendsForAllRegions(records, populationMap) {
        let regions = unique(records.map(r => r.region))

        function rankRecords(regions, records, propertyNames) {
            return regions.map(region => {
                let regionRecords = records.filter(r => r.region === region).sort(compare_records_by_date)
                let dataToAnalyze = new DeltaDecorator().decorate(regionRecords)
                let nDayAverageDecorator = new NDayAverageDecorator();
                dataToAnalyze = nDayAverageDecorator.decorate(dataToAnalyze, 7, "sevenDayAvg")
                dataToAnalyze = nDayAverageDecorator.decorate(dataToAnalyze, 14, "fourteenDayAvg")

                let boundaryRecords = new BoundaryFinder(7).findBoundaryRecords(dataToAnalyze)
                let result = {region: region}
                propertyNames.forEach(name => {
                    result[name] = new RegionTrendCalculator(populationMap).calculateTrend(boundaryRecords, "sevenDayAvg", name)
                })

                return result
            });
        }

        let rankingRecords = rankRecords(regions, records, this.propertyNames);
        return rankingRecords
    }

}