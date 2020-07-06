
import UsaPopulation from '../../../json/population/USA.json'
import UsTerritoryPopulation from '../../../json/population/US_Territories.json'
import {StateTable} from "./states";
let stateTable = new StateTable()

function normalizeUsaData(json) {
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


export const USA_POPULATION = new  Map([...normalizeUsaData(UsaPopulation), ...normalizeTerritoryData(UsTerritoryPopulation)])