import Aggregator from "../../src/covid_tracking_com/aggregator";
import {expect} from "@jest/globals";

let date1 = new Date(2020, 4, 1);
let date2 = new Date(2020, 4, 2);

test('aggregation of records with valid data', () => {
    let input = [
        { date: date1, positive: 1, death: 2, hospitalized: 4},
        { date: date2, positive: 64, death: 128, hospitalized: 256},
        { date: date1, positive: 8, death: 16, hospitalized: 32},
    ]

    let output = new Aggregator(['positive', 'death', 'hospitalized']).aggregate(input)
    expect(output.length).toBe(2);
    expect(output).toEqual([
        { date: date1, positive: 9, death: 18, hospitalized: 36},
        { date: date2, positive: 64, death: 128, hospitalized: 256}
    ]);
})

test('aggregation with better dateComparison', () => {
    let input = [
        { date: new Date(2020, 4, 1), positive: 1, death: 2, hospitalized: 4},
        { date: new Date(2020, 4, 1), positive: 8, death: 16, hospitalized: 32},
    ]

    let output = new Aggregator(['positive', 'death', 'hospitalized']).aggregate(input)
    expect(output).toEqual([
        { date: new Date(2020, 4, 1), positive: 9, death: 18, hospitalized: 36},
    ]);
})

test('aggregation with leading nulls', () => {
    let input = [
        { date: date1, foo: null},
        { date: date1, foo: 1},
        { date: date2, foo: 2},
        { date: date2, foo: 4},
    ]

    let output = new Aggregator(['foo']).aggregate(input)

    expect(output).toEqual([
        { date: date1, foo: 1 },
        { date: date2, foo: 6 }
    ]);
})
test('aggregation with leading undefined', () => {
    let input = [
        { date: date1},
        { date: date1, foo: 1},
        { date: date2, foo: 2},
        { date: date2, foo: 4},
    ]

    let output = new Aggregator(['foo']).aggregate(input)

    expect(output).toEqual([
        { date: date1, foo: 1 },
        { date: date2, foo: 6 }
    ]);
})
test('aggregation with leading nulls for all first records', () => {
    let input = [
        { date: date1, foo: null},
        { date: date1, foo: null},
        { date: date2, foo: 2},
        { date: date2, foo: 4},
    ]

    let output = new Aggregator(['foo']).aggregate(input)

    expect(output).toEqual([
        { date: date1, foo: null },
        { date: date2, foo: 6 }
    ]);
})
test('aggregation with leading undefined for all first records', () => {
    let input = [
        { date: date1},
        { date: date1},
        { date: date2, foo: 2},
        { date: date2, foo: 4},
    ]

    let output = new Aggregator(['foo']).aggregate(input)

    expect(output).toEqual([
        { date: date1},
        { date: date2, foo: 6 }
    ]);
})
