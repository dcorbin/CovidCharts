import {StateTable} from "../states";
import {COVID_TRACKING_PROPERTIES} from "./covid_tracking_com";

export default class CovidTrackingData {
    constructor(covidTrackingRecords) {
        function calculateDataSeriesByState(records) {
            function dataSeriesAvailable(records, rawDataPropertyNames, state) {
                return  rawDataPropertyNames.map(propertyName => {
                    let hasValidData = records.filter(r => r.state === state).map(r => r[propertyName]).some(v => {
                            return !(v === null);
                        }
                    )
                    if (hasValidData) {
                        return propertyName
                    }
                    return null
                }).filter(x => x != null)
            }


            let allStates = new StateTable().all_abbreviations();
            return allStates.reduce( (result, state) => {
                result[state] = dataSeriesAvailable(records, COVID_TRACKING_PROPERTIES, state)
                return result
            }, {})
        }
        this.records = covidTrackingRecords
        this.dataSeriesByState = calculateDataSeriesByState(covidTrackingRecords)
    }
}
