import NormalizedRecordSet, {STANDARD_DATA_PROPERTIES} from "./covid_tracking_com/normalized_record_set";

export default class GeorgiaByCounty {
    getData() {
        function normalize_data(records) {

            return records.map(record => {
                function normalizeNumber(v) {
                    if (typeof v === 'undefined') {
                        return null
                    }
                    return v
                }

                let normalizedRecord = {
                    date: new Date(Date.parse(record.date)),
                    region: record.county
                }
                if (normalizedRecord.region === "Non-Georgia Resident") {
                    normalizedRecord.region = "NGR"
                }

                STANDARD_DATA_PROPERTIES.forEach(property => {
                    normalizedRecord[property] = normalizeNumber(record[property]);
                })
                return normalizedRecord
            })
        }

        return fetch('/GA-By-County.json', {method: 'GET', })
            .then(response => response.json())
            .then(data => {

                let normalizedData = normalize_data(data);
                return new NormalizedRecordSet(normalizedData)
            })
            .catch((error) => {
                console.error('Error fetching normalizedRecordSet:', error);
            });
    }
}


export class CountyRegionSpec {
    constructor() {
        this.singleNoun = 'county'
        this.pluralNoun = 'counties'
        this.displayNameFor = function(region) {
            return region
        }
        this.quickPicks = createQuickPicks()
    }
}

function createQuickPicks() {
    return [
        {
            key: 'none',
            text: "None",
            regions: []
        },
    ]
}