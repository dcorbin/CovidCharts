import {STANDARD_DATA_PROPERTIES} from "./covid_tracking_com/normalized_record_set";
import {RANKERS} from "./model/trends/rankers/rankers";

function validStringValues(validValues) {
    return (v) => {
        return (validValues.find(f => f === v) || null);
    }
}

function validNumbers(validNumbers) {
    return (value) => {
        const n = parseInt(value)
        if (isNaN(n)) {
            return null
        }
        const found = validNumbers.find(f => f === n);
        if (typeof(found) === 'undefined') {
            return null
        }
        return found;
    }
}

export default class UrlManager {
    constructor(focusList, validRegions) {
        this.focusList = focusList
        this.settingParsers = {
            dataFocus: value => (this.focusList.find(f => f.key === value) || null),
            nullStrategy: validStringValues(['none', 'leadingNullAsZero']),
            movingAvgStrategy:  validNumbers([1, 3, 7, 14]),
            activeTab:  validNumbers([0, 1]),
            dataLinesId: validStringValues(['ALL'].concat(STANDARD_DATA_PROPERTIES)),
            ranker: validStringValues(RANKERS.map(r => r.key)),
            verticalScaleType: validStringValues(['linear', 'logarithmic']),
            selectedRegions: (value, priorElements) => {
                if (typeof(priorElements.dataFocus) === 'undefined') {
                    return null
                }
                if (value === '' || typeof(value) === 'undefined') {
                    return []
                }
                const regions = value.split(',');
                return regions.filter( r => validRegions[priorElements.dataFocus.key].includes(r))
            }
        }
    }
    parse(location) {
        const url = new URL(location)
        const parts = url.hash.replace(/^#/, '').split('/')
        let result = {}
        while (parts.length > 0) {
            const key = parts[0];
            const value = parts[1];
            const parser = this.settingParsers[key]
            if (parser != null) {
                const parsedValue = parser(value, result)
                if (parsedValue != null)
                    result[key] = parsedValue
            }

            parts.shift()
            parts.shift()
        }

        return result;
    }
}