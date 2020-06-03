import {expect} from "@jest/globals";
import DataQualityAssessor from "../../src/js/covid_tracking_com/data_quality_assessor";

let date1 = new Date(2020, 4, 1);
let date2 = new Date(2020, 4, 2);
let date3 = new Date(2020, 4, 3);
let date4 = new Date(2020, 4, 4);

const assessor = new DataQualityAssessor(["foo", "bar"])
test('aggregation of single record', () => {
    const input = [
        { date: date1, state: 'AB', foo: 1, bar: 2},
    ]

    const assessmentByState = assessor.assessQuality(input)
    expect([...assessmentByState.keys()]).toEqual(['AB'])
    expect([...assessmentByState.get('AB').keys()]).toEqual(["foo", "bar"])
    expect(assessmentByState.get('AB').get("bar")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('AB').get("foo")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
})

test('with only nulls in a series', () => {
    const input = [
        { date: date1, state: 'AB', foo: null, bar: 2},
        { date: date2, state: 'AB', foo: null, bar: 2},
    ]

    const assessmentByState = assessor.assessQuality(input)
    expect([...assessmentByState.keys()]).toEqual(['AB'])
    expect([...assessmentByState.get('AB').keys()]).toEqual(["foo", "bar"])
    expect(assessmentByState.get('AB').get("bar")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('AB').get("foo")).toEqual({
        validDataStartingAt: null,
        continuous: false
    })
})

test('with  leading nulls in a series', () => {
    const input = [
        { date: date1, state: 'AB', foo: null, bar: 2},
        { date: date2, state: 'AB', foo: null, bar: 2},
        { date: date3, state: 'AB', foo: 1, bar: 2},
        { date: date4, state: 'AB', foo: 4, bar: 2},
    ]

    const assessmentByState = assessor.assessQuality(input)
    expect([...assessmentByState.keys()]).toEqual(['AB'])
    expect([...assessmentByState.get('AB').keys()]).toEqual(["foo", "bar"])
    expect(assessmentByState.get('AB').get("bar")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('AB').get("foo")).toEqual({
        validDataStartingAt: date3,
        continuous: true
    })
})

test('with nulls in the middle of data', () => {
    const input = [
        { date: date1, state: 'AB', foo: 1, bar: 2},
        { date: date2, state: 'AB', foo: null, bar: 2},
        { date: date3, state: 'AB', foo: 1, bar: 2},
        { date: date4, state: 'AB', foo: 4, bar: 2},
    ]

    const assessmentByState = assessor.assessQuality(input)
    expect([...assessmentByState.keys()]).toEqual(['AB'])
    expect([...assessmentByState.get('AB').keys()]).toEqual(["foo", "bar"])
    expect(assessmentByState.get('AB').get("bar")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('AB').get("foo")).toEqual({
        validDataStartingAt: date1,
        continuous: false
    })
})

test('aggregation of multiple states', () => {
    const input = [
        { date: date1, state: 'AB', foo: 1, bar: 2},
        { date: date1, state: 'CD', foo: 1, bar: 2},
    ]

    const assessmentByState = assessor.assessQuality(input)
    expect([...assessmentByState.keys()]).toEqual(['AB', 'CD'])
    expect([...assessmentByState.get('AB').keys()]).toEqual(["foo", "bar"])
    expect([...assessmentByState.get('CD').keys()]).toEqual(["foo", "bar"])
    expect(assessmentByState.get('AB').get("bar")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('AB').get("foo")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('CD').get("bar")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
    expect(assessmentByState.get('CD').get("foo")).toEqual({
        validDataStartingAt: date1,
        continuous: true
    })
})
