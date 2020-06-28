import NormalizedRecordSet from "../covid_tracking_com/normalized_record_set";

export default class UsPopulationLoader {
    getData() {
        function normalizeData(json) {
                json.data.reduce((result, stateRecord) => {
                result.set(stateRecord.State, stateRecord.Pop)
            }, new Map())
        }
        return fetch('/api/data/population/USA.json', {method: 'GET', })
            .then(response => {
                if (response.status === 200)
                    return response.json();
                throw 'Failure fetching populationData (US): ' + response.status
            })
            .then(data => {
                return  normalizeData(data)
            })
            .catch((error) => {
                console.error('Error fetching population data(US):', error);
                return new Map()
            });

    }
}