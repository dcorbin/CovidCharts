import {unique} from "../../util/unique";
import {compare_records_by_date} from "../../util/date_comparison";
import DeltaDecorator from "../../covid_tracking_com/delta_decorator";
import NDayAverageDecorator from "../../covid_tracking_com/n_day_avg_decorator";

export class GrowthRanker {
    constructor() {
    }
    rank(records) {
        let regions = unique(records.map(r => r.region))

        function regionalGrowthPercentage(dataToAnalyze, propertyNames) {
            let current = dataToAnalyze[0]
            let cutoff = current.date.getTime() - (1000 * 60 * 60 * 24 * 7);
            let past = dataToAnalyze.find(r => r.date.getTime() <= cutoff)


            let result = {}
            propertyNames.forEach(name => {
                if (past === null) {
                    result[name] = {currentValue: current[name], delta: null, percentage: null}
                }
                let delta = current.nDayAverages[name] - past.nDayAverages[name];
                let deltaPercentage = delta/past.nDayAverages[name]*100;
                result[name] = {
                        currentValue: current[name],
                        delta: delta,
                        percentage: deltaPercentage
                }
            })
            if (current.region === 'GA') {
                console.log(`CURRENT: ${JSON.stringify(current)}`)
                console.log(`PAST   : ${JSON.stringify(past)}`)
                console.log(`SUMMARY: ${JSON.stringify(result)}`)
            }
            result.region = current.region
            return result
        }

        return regions.map(region => {
            let regionRecords = records.filter(r => r.region === region).sort(compare_records_by_date)
            let dataToAnalyze = new DeltaDecorator().decorate(regionRecords)
            dataToAnalyze = new NDayAverageDecorator().decorate(dataToAnalyze, 7)
            dataToAnalyze = dataToAnalyze.reverse()

            return regionalGrowthPercentage(dataToAnalyze, ["new_positives", "new_deaths", "new_hospitalizations"])
        }).
        sort((a,b) => b.new_positives.percentage - a.new_positives.percentage )
    }

}