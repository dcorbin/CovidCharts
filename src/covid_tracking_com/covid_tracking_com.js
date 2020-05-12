export default class CovidTrackingCom {
    getData() {
        function normalize_data(records) {
            function date_from_8digit_integer(n) {
                const year = Math.floor(n / 10000)
                const month = Math.floor((n - year * 10000) / 100)
                const day_of_month = n % 100
                return new Date(year, month - 1, day_of_month)
            }

            return records.map(record => {
                let updated_record = Object.assign({}, record)
                updated_record.date = date_from_8digit_integer(record.date)
                return updated_record
            })
        }

        return fetch('https://covidtracking.com/api/v1/states/daily.json', {method: 'GET', })
            .then(response => response.json())
            .then(data => {
                return normalize_data(data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
}