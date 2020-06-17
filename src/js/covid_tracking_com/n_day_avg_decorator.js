import copyData from "../util/copyData";

export default class NDayAverageDecorator {
    decorate(data, nDays=7) {
        function moving_average(array, index, days, property, base_property) {
            let start_of_block = index - days + 1;
            if (start_of_block < 0)
                start_of_block = 0
            let last7 = array.slice(start_of_block, index + 1);
            last7 = last7.filter(r => r[property] != null)
            if (last7.length < days)
                return;
            let total = last7.reduce((a, b) => a + b[property], 0);
            return total / days;
        }

        data = copyData(data)

        data.forEach((r, index, array) => {
            r.nDayAverages = {}
            if (index >= nDays) {
                r.nDayAverages.new_hospitalizations = moving_average(array, index, nDays, 'delta_hospitalized', 'hospitalized')
                r.nDayAverages.new_positives = moving_average(array, index, nDays, 'delta_positive', 'positive')
                r.nDayAverages.new_deaths = moving_average(array, index, nDays, 'delta_death', 'death')
            }
        })
        return data;
    }

}
