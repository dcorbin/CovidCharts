import NormalizedRecordSet, {STANDARD_DATA_PROPERTIES} from "./normalized_record_set";
import debugDataLog from "./debug_data_log";

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
                function normalizeNumber(v) {
                    if (typeof v === 'undefined') {
                        return null
                    }
                    return v
                }

                let normalizedRecord = {
                    date: date_from_8digit_integer(record.date),
                    region: record.state
                }

                STANDARD_DATA_PROPERTIES.forEach(property => {
                    normalizedRecord[property] = normalizeNumber(record[property]);
                })
                return normalizedRecord
            })
        }

        return fetch('https://covidtracking.com/api/v1/states/daily.json', {method: 'GET', })
            .then(response => response.json())
            .then(data => {
                debugDataLog("Raw Data", data, 'AS')

                let normalizedData = normalize_data(data);
                debugDataLog("Raw Data", normalizedData, 'AS')
                return new NormalizedRecordSet(normalizedData)
            })
            .catch((error) => {
                console.error('Error fetching normalizedRecordSet:', error);
            });
    }
}
