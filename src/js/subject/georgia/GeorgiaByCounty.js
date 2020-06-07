import NormalizedRecordSet, {STANDARD_DATA_PROPERTIES} from "../../covid_tracking_com/normalized_record_set";
import QuickPick from '../../model/quick_pick'
import React from 'react'

export const NON_RESIDENT_CODE = '~ngr';
export const UNKNOWN_CODE = '~unknown';

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

export default class GeorgiaByCounty {
    getData() {
        function normalize_data(records) {

            function parseDate(date) {
                let match = date.match(/(?<year>\d\d\d\d)-(?<month>\d\d)-(?<day>\d\d)/)
                return new Date(parseInt(match.groups.year), parseInt(match.groups.month)-1, parseInt(match.groups.day))
            }
            return records.map(record => {
                function normalizeNumber(v) {
                    if (typeof v === 'undefined') {
                        return null
                    }
                    return v
                }

                let normalizedRecord = {
                    date: parseDate(record.date),
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

        return fetch('/api/data/GA-By-County.json', {method: 'GET', })
            .then(response => {
                if (response.status === 200)
                    return response.json()
                throw 'Failure fetching data (GA): ' + response.status
            })
            .then(data => {
                let normalizedData = normalize_data(data);
                return new NormalizedRecordSet(normalizedData)
            })
            .catch((error) => {
                console.error('Error fetching normalizedRecordSet:', error);
                return NormalizedRecordSet.forError('Error fetching data for GA')
            });
    }
}

export function createQuickPicks() {
    return [
        QuickPick.NONE,
        QuickPick.createDynamic("georgia", "Georgia",  r => r !== NON_RESIDENT_CODE),
        QuickPick.createStatic("atlanta", "Atlanta", ['Fulton', 'DeKalb']),
        QuickPick.createStatic("atlanta5", "Metro Atlanta (5)", ['Fulton', 'DeKalb', 'Gwinnett', 'Clayton', 'Cobb']),
        QuickPick.createStatic("atlanta-masa", "Metro Atlanta Statistical Area", METRO_ATLANTA_STATISTICAL_AREA),
        QuickPick.createDynamic("georgia-minus-atlanta-masa", "Georgia - Metro Atlanta Statistical Area",
            r => !METRO_ATLANTA_STATISTICAL_AREA.includes((r))
            ),
        QuickPick.createStatic("athens-clark-metro", "Athens/Clarke County Area", [
            "Clarke",
            "Madison",
            "Oconee",
            "Oglethorpe",
        ]),
        QuickPick.createStatic("dougherty", "Dougherty 'metro'", [
            "Dougherty",
            "Lee",
            "Terrell",
            "Baker",
            "Mitchell",
            "Worth",
            "Calhoun",
        ]),
        QuickPick.createStatic("hall+", "Hall county plus", [
            "Hall",
            "White",
            "Habersham",
        ]),
    ]
}
