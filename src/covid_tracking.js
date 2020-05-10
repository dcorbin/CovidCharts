class CovidTrackingCache {
    constructor() {
        this.data = null
    }
    store(data) {
        this.data = data
    }
    fetch() {
        return this.data
    }

}

function process_covid_data(covid_tracking_data) {
    function compare_records_by_date(a, b) {
        if (a.date < b.date)
            return -1
        if (a.date > b.date)
            return 1
        return 0
    }

    function date_from_8digit_integer(n) {
        const year = Math.floor(n / 10000)
        const month = Math.floor((n - year * 10000) / 100)
        const day_of_month = n % 100
        return new Date(year, month - 1, day_of_month)
    }

    function normalize_data(records) {
        return records.map(record => {
            let updated_record = Object.assign({}, record)
            updated_record.date = date_from_8digit_integer(record.date)
            return updated_record
        })
    }


    let normalized_covid_tracking_data = normalize_data(covid_tracking_data)
    let states = [...new Set(normalized_covid_tracking_data.map(r => r.state))].sort();
    let covid_data_by_state = {}
    states.forEach(state => {
        function calculate_per_state_extras(state_records) {
            function moving_average(array, index, days, property, base_property) {
                let start_of_block = index - days + 1;
                if (start_of_block < 0)
                    start_of_block = 0
                let last7 = array.slice(start_of_block, index + 1);
                last7 = last7.filter(r => r[property] != null)
                if (last7.length < days)
                    return;
                let total = last7.reduce((a, b) => a + b[property], 0);
                let avg = total / days;
                return avg;
            }

            function delta(array, index, property) {
                if (index === 0)
                    return null
                if (array[index - 1][property] === null)
                    return null
                return array[index][property] - array[index - 1][property]
            }

            let data = state_records.map(r => Object.assign({}, r))
            data.sort(compare_records_by_date)


            data.forEach((r, index, array) => {
                r.delta_hospitalized = delta(array, index, "hospitalized")
                r.delta_positive = delta(array, index, "positive")
                r.delta_death = delta(array, index, "death")

                r.seven_day_averages = {}
                if (index > 6) {
                    r.seven_day_averages.new_hospitalizations = moving_average(array, index, 7, 'delta_hospitalized', 'hospitalized')
                    r.seven_day_averages.new_positives = moving_average(array, index, 7, 'positiveIncrease', 'positive')
                    r.seven_day_averages.new_deaths = moving_average(array, index, 7, 'deathIncrease', 'death')
                }

            })
            return data
        }

        let state_data = normalized_covid_tracking_data.filter(r => r.state === state).sort(compare_records_by_date)
        covid_data_by_state[state] = calculate_per_state_extras(state_data)
    })

    return covid_data_by_state
}

class CovidTracking {
    static fetch_covid_tracking_data_p(cache) {

        return fetch('https://covidtracking.com/api/v1/states/daily.json', {
            method: 'GET', // or 'PUT'
        })  .then(response => response.json())
            .then(data => {
                let covid_data_by_state = process_covid_data(data)
                cache.store(covid_data_by_state)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

export { CovidTracking, CovidTrackingCache }