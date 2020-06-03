import {expect} from "@jest/globals";
import LeadingNullAsZeroConverter from "../../src/js/covid_tracking_com/leading_null_as_zero_converter";

let date1 = new Date(2020, 4, 1);
let date2 = new Date(2020, 4, 2);
let date3 = new Date(2020, 4, 3);
let date4 = new Date(2020, 4, 4);

const converter = new LeadingNullAsZeroConverter(["foo", "bar"])
test('aggregation with No Nulls', () => {
    const input = [
        { date: date3, state: 'AB', foo: 1, bar: 2},
        { date: date2, state: 'AB', foo: 1, bar: 2},
        { date: date1, state: 'AB', foo: 1, bar: 2},
    ]

    const output = converter.convert(input)

    expect(output).toEqual([
            { date: date1, state: 'AB', foo: 1, bar: 2},
            { date: date2, state: 'AB', foo: 1, bar: 2},
            { date: date3, state: 'AB', foo: 1, bar: 2},
        ]
    )
})


test('aggregation with Nulls', () => {
    const input = [
        { date: date3, state: 'AB', foo: 1, bar: null},
        { date: date2, state: 'AB', foo: null, bar: 2},
        { date: date1, state: 'AB', foo: null, bar: 2},
        { date: date4, state: 'AB', foo: 1, bar: 2},
    ]

    const output = converter.convert(input)

    expect(output).toEqual([
            { date: date1, state: 'AB', foo: 0, bar: 2},
            { date: date2, state: 'AB', foo: 0, bar: 2},
            { date: date3, state: 'AB', foo: 1, bar: null},
            { date: date4, state: 'AB', foo: 1, bar: 2},
        ]
    )
})
test('aggregation with Nulls and MultipleStates', () => {
    const input = [
        { date: date1, state: 'AB', foo: 1, bar: null},
        { date: date1, state: 'CD', foo: null, bar: 2},
        { date: date2, state: 'AB', foo: null, bar: 2},
        { date: date2, state: 'CD', foo: 1, bar: 2},
    ]

    const output = converter.convert(input)

    expect(output).toEqual([
            { date: date1, state: 'AB', foo: 1, bar: 0},
            { date: date2, state: 'AB', foo: null, bar: 2},
            { date: date1, state: 'CD', foo: 0, bar: 2},
            { date: date2, state: 'CD', foo: 1, bar: 2},
        ]
    )
})
