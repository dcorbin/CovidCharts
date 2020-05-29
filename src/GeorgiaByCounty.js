import NormalizedRecordSet, {STANDARD_DATA_PROPERTIES} from "./covid_tracking_com/normalized_record_set";

import React from 'react'
import GA from 'Maps/GA'

const NON_RESIDENT_CODE = '~ngr';
const UNKNOWN_CODE = '~unknown';
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
                    normalizedRecord.region = NON_RESIDENT_CODE
                }
                if (normalizedRecord.region === "Unknown") {
                    normalizedRecord.region = UNKNOWN_CODE
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
            if (region === NON_RESIDENT_CODE) {
                return <i>Non-resident</i>
            }
            if (region === UNKNOWN_CODE) {
                return <i>Unknown</i>
            }
            return region
        }
        this.quickPicks = createQuickPicks()
        this.map = GA
    }
}
function createQuickPicks() {
    let METRO_ATLANTA_STATISTICAL_AREA = [
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
    ];
    return [
        {
            key: 'none',
            text: "None",
            regions: []
        },
        {
            key: 'georgia',
            text: "Georgia",
            regions: null,
            regionsFilter: r => r !== NON_RESIDENT_CODE
        },
        {
            key: 'atlanta',
            text: "Atlanta",
            regions: ['Fulton', 'DeKalb']
        },
        {
            key: 'atlanta5',
            text: "Metro Atlanta (5)",
            regions: ['Fulton', 'DeKalb', 'Gwinnett', 'Clayton', 'Cobb']
        },
        {
            key: 'atlanta-masa',
            text: "Metro Atlanta Statistical Area",
            regions: METRO_ATLANTA_STATISTICAL_AREA
        },
        {
            key: 'georgia-minus-atlanta-masa',
            text: "Georgia - Metro Atlanta Statistical Area",
            regions: null,
            regionsFilter: r => !METRO_ATLANTA_STATISTICAL_AREA.includes((r))
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
