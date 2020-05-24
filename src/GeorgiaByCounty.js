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
        {
            key: 'atlanta',
            text: "Atlanta",
            regions: ['Fulton', 'Dekalb']
        },
        {
            key: 'atlanta5',
            text: "Metro Atlanta (5)",
            regions: ['Fulton', 'Dekalb', 'Gwinett', 'Clayton', 'Cobb']
        },
        {
            key: 'atlanta-masa',
            text: "Metro Atlanta Statistical Area",
            regions: [
                "Fulton",
                "Gwinnett",
                "Cobb",
                "DeKalb",
                "Clayton",
                "Cherokee",
                "Forsyth",
                "Henry",
                "Paulding",
                "Coweta",
                "Douglas",
                "Carroll",
                "Fayette",
                "Newton",
                "Bartow",
                "Walton",
                "Rockdale",
                "Barrow",
                "Spalding",
                "Pickens",
                "Haralson",
                "Dawson",
                "Butts",
                "Meriwether",
                "Lamar",
                "Morgan",
                "Pike",
                "Jasper",
                "Heard",
            ]
        },
        {
            key: 'athens-clark-metro',
            text: "Athens/Clarke County Area",
            regions: [
                "Clarke",
                "Madison",
                "Oconee",
                "Oglethorpe",
            ]
        },
        {
            key: 'dougherty',
            text: "Dougherty 'metro'",
            regions: [
                "Dougherty",
                "Lee",
                "Terrell",
                "Baker",
                "Mitchell",
                "Worth",
            ]
        },
        {
            key: 'hall+',
            text: "Hall county plus",
            regions: [
                "Hall",
                "White",
                "Habersham",
            ]
        },
    ]
}
