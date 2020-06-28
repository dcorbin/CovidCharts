import NormalizedRecordSet, {STANDARD_DATA_PROPERTIES} from "./normalized_record_set";
import {StateTable} from "../subject/us/states";

export default class CovidTrackingCom {
    getData() {
        let stateTable = new StateTable();

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
            .then(response => {
                if (response.status === 200)
                    return response.json();
                throw 'Failure fetching data (CovidTracking.com): ' + response.status
            })
            .then(data => {
                let normalizedData = normalize_data(data);
                return new NormalizedRecordSet(normalizedData)
            })
            .catch((error) => {
                console.error('Error fetching normalizedRecordSet:', error);
                return NormalizedRecordSet.forError('Error fetching data for US')
            });
    }
}
