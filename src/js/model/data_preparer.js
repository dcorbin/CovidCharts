import {compare_records_by_date} from "../util/date_comparison";
import LeadingNullAsZeroConverter from "../covid_tracking_com/leading_null_as_zero_converter";
import Aggregator from "../covid_tracking_com/aggregator";
import DeltaDecorator from "../covid_tracking_com/delta_decorator";
import NDayAverageDecorator from "../covid_tracking_com/n_day_avg_decorator";

export default class DataPreparer {
    static prepareDataToChart(normalizedRecordSet, selectedRegions, lines, nDayAverage, treatLeadingNullsAsZero) {
        let dataLinePropertyNames = lines.map(l => l.sourceProperty).filter(name => {
                return selectedRegions.every(region => normalizedRecordSet.hasValidData(region, name));
            }
        )

        let dataToChart = normalizedRecordSet.records.filter(r => selectedRegions.includes(r.region)).sort(compare_records_by_date)

        if (treatLeadingNullsAsZero) {
            dataToChart = new LeadingNullAsZeroConverter(dataLinePropertyNames).convert(dataToChart)
        }
        dataToChart = new Aggregator(dataLinePropertyNames).aggregate(dataToChart)
        dataToChart = new DeltaDecorator().decorate(dataToChart)
        dataToChart = new NDayAverageDecorator().decorate(dataToChart, nDayAverage)
        return dataToChart
    }

}