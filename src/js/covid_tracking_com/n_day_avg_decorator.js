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
                r.nDayAverages.deltaHospitalized = moving_average(array, index, nDays, 'deltaHospitalized', 'hospitalized')
                r.nDayAverages.deltaPositive = moving_average(array, index, nDays, 'deltaPositive', 'positive')
                r.nDayAverages.deltaDeath = moving_average(array, index, nDays, 'deltaDeath', 'death')
            }
        })
        return data;
    }

}
