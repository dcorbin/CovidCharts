import Aggregator from "../../src/covid_tracking_com/aggregator";
import {expect} from "@jest/globals";

let date1 = new Date(2020, 4, 1);
let date2 = new Date(2020, 4, 2);
let date3 = new Date(2020, 4, 3);
let date4 = new Date(2020, 4, 4);

const aggregator = new Aggregator(["foo", "bar"])
test('aggregation of single record', () => {
    const input = [
        { date: date1, foo: 1, bar: 2},
    ]

    const output = aggregator.aggregate(input)

    expect(output).toEqual(input)
    expect(output[0]).not.toBe(input[0])
})
test('aggregation of multiple records with no date duplication', () => {
    const input = [
        { date: date1, foo: 1, bar: 2},
        { date: date2, foo: 2, bar: 4},
        { date: date3, foo: 4, bar: 16},
    ]

    const output = aggregator.aggregate(input)

    expect(output).toEqual(input)
})
test('aggregation of common date-records are added together', () => {
    const input = [
        { date: new Date(2020, 4, 1), foo: 1, bar: 2},
        { date: new Date(2020, 4, 1), foo: 2, bar: 4},
        { date: new Date(2020, 4, 2), foo: 4, bar: 16},
    ]

    const output = aggregator.aggregate(input)

    expect(output).toEqual([
        { date: date1, foo: 3, bar: 6},
        { date: date2, foo: 4, bar: 16},
    ])
})

test("when a lead value is null", () => {
    const input = [
        { date: date1, foo: null, bar: 2},
        { date: date1, foo: 2, bar: 4},
    ]

    const output = aggregator.aggregate(input)

    expect(output).toEqual([
        { date: date1, foo: null, bar: 6},
    ])

})

test("when a middle value is null", () => {
    const input = [
        { date: date1, foo: 1, bar: 1},
        { date: date1, foo: null, bar: 2},
        { date: date1, foo: 4, bar: 4},
    ]

    const output = aggregator.aggregate(input)

    expect(output).toEqual([
        { date: date1, foo: null, bar: 7},
    ])
})

test("when a an undefined value is received", () => {
    const input = [
        { date: date1, foo: 1, bar: 1},
        { date: date1, foo: 2 },
        { date: date1, foo: 4, bar: 4},
    ]

    expect(() => aggregator.aggregate(input)).toThrow(new Error("'bar' is undefined in one or more records."))
})