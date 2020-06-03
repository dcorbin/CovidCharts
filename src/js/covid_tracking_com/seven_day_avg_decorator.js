import copyData from "../util/copyData";

export default class SevenDayAverageDecorator {
    decorate(data) {
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
            r.seven_day_averages = {}
            if (index > 6) {
                r.seven_day_averages.new_hospitalizations = moving_average(array, index, 7, 'delta_hospitalized', 'hospitalized')
                r.seven_day_averages.new_positives = moving_average(array, index, 7, 'delta_positive', 'positive')
                r.seven_day_averages.new_deaths = moving_average(array, index, 7, 'delta_death', 'death')
            }
        })
        return data;
    }

}
