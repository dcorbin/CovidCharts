import {StateTable} from "../subject/us/states";

export default class UsPopulationLoader {
    getData() {
        let stateTable = new StateTable()
        function normalizeData(json) {
            return json.data.reduce((result, stateRecord) => {
                result.set(stateTable.abbreviationFromName(stateRecord.State), stateRecord.Pop)
                return result
            }, new Map())
        }
        function normalizeTerritoryData(json) {
            return json.data.reduce((result, stateRecord) => {
                result.set(stateTable.abbreviationFromName(stateRecord.country),
                    parseInt(stateRecord.pop2020.replace('.', '')) / 10)
                return result
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
            }).then(usPopulationMap => {
                return fetch('/api/data/population/US_Territories.json', {method: 'GET', })
                .then(response => {
                    if (response.status === 200)
                        return response.json();
                    throw 'Failure fetching populationData (US): ' + response.status
                }).then(data => {
                    let territoryMap = normalizeTerritoryData(data)
                    return new Map([...territoryMap, ...usPopulationMap])
                })
            })
            .catch((error) => {
                console.error('Error fetching population data(US):', error);
                return new Map()
            });

    }
}