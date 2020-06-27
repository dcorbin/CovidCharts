import Aggregator from "../../src/js/covid_tracking_com/aggregator";
import {expect} from "@jest/globals";
import NormalizedRecordSet from "../../src/js/covid_tracking_com/normalized_record_set";

let date1 = new Date(2020, 4, 1);
let date2 = new Date(2020, 4, 2);
let date3 = new Date(2020, 4, 3);

test('mostRecentDate when empty', () => {
    const recordSet = new NormalizedRecordSet([])

    expect(recordSet.mostRecentDate()).toBeNull()
})
test('mostRecentDate when not empty', () => {
    const input = [
        { date: date1, region: 'alpha', foo: 1, bar: 2},
        { date: date2, region: 'alpha', foo: 1, bar: 2},
        { date: date3, region: 'alpha', foo: 1, bar: 2},
        { date: date2, region: 'beta', foo: 1, bar: 2},
    ]
    const recordSet = new NormalizedRecordSet(input)

    expect(recordSet.mostRecentDate()).toEqual(date3)
})
