export default class GaPopulationLoader {
    getData() {
        function normalizeData(json) {
                json.data.reduce((result, countyRecord) => {
                result.setItem(countyRecord.CTYNAME, countyRecord.Pop)
            }, new Map())
        }
        return fetch('/api/data/population/GA.json', {method: 'GET', })
            .then(response => {
                if (response.status === 200)
                    return response.json();
                throw 'Failure fetching populationData (GA): ' + response.status
            })
            .then(data => {
                return  normalizeData(data)
            })
            .catch((error) => {
                console.error('Error fetching population data(GA):', error);
                return new Map()
            });

    }
}