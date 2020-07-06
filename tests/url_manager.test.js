import {expect, jest} from "@jest/globals";
import UrlManager from "../src/js/url_manager";
const focusList = [ {key: 'alpha', name: 'Able'}, {key: 'colors', name: 'Bob'}, {key: 'gamma', name: 'Charlie'}]
let urlManager = new UrlManager(focusList, {
    colors: ['red', 'green', 'blue'],
    shapes: ['circle', 'square', 'triangle']
})
test('url parsing dataFocus happyPath', () => {
    let  result = urlManager.parse("http://dummy.com/#dataFocus/colors")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
})

test('url parsing selectedRegions happyPath', () => {
    let  result = urlManager.parse("http://dummy.com/#dataFocus/colors/selectedRegions/red,blue")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
    expect(result.selectedRegions).toEqual(['red', 'blue'])
})

test('url parsing selectedRegions single', () => {
    let  result = urlManager.parse("http://dummy.com/#dataFocus/colors/selectedRegions/red")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
    expect(result.selectedRegions).toEqual(['red'])
})
test('url parsing selectedRegions in the wrong order', () => {
    let  result = urlManager.parse("http://dummy.com/#selectedRegions/red/dataFocus/colors")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
    expect(result.selectedRegions).toBeUndefined()
})
test('url parsing selectedRegions with No Regions', () => {
    let  result = urlManager.parse("http://dummy.com/#dataFocus/colors/selectedRegions/")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
    expect(result.selectedRegions).toEqual([])
})

test('url parsing selectedRegions with no value given', () => {
    let  result = urlManager.parse("http://dummy.com/#dataFocus/colors/selectedRegions")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
    expect(result.selectedRegions).toEqual([])
})

test('url parsing selectedRegions withSomeInvalid', () => {
    let  result = urlManager.parse("http://dummy.com/#dataFocus/colors/selectedRegions/red,square")

    expect(result.dataFocus).toEqual({name: 'Bob', key: 'colors'})
    expect(result.selectedRegions).toEqual(['red'])
})

test('url parsing nullStrategy happyPath', () => {
    ['none','leadingNullAsZero'].forEach(value => {
        let  result = urlManager.parse(`http://dummy.com/#nullStrategy/${value}`)
        expect(result).toEqual({nullStrategy: value})
    })
})
test('url parsing movingAvgStrategy happyPath', () => {
    [1, 3, 7, 14].forEach(value => {
        let  result = urlManager.parse(`http://dummy.com/#movingAvgStrategy/${value}`)
        expect(result).toEqual({movingAvgStrategy: value})
    })
})
test('url parsing dataLinesId happyPath', () => {
    ['ALL', 'positive', 'death', 'hospitalized'].forEach(value => {
        let  result = urlManager.parse(`http://dummy.com/#dataLinesId/${value}`)
        expect(result).toEqual({dataLinesId: value})
    })
})
test('url parsing activeTab happyPath', () => {
    [0, 1].forEach(value => {
        let  result = urlManager.parse(`http://dummy.com/#activeTab/${value}`)
        expect(result).toEqual({activeTab: value})
    })
})
test('url parsing ranker happyPath', () => {
    ['rate', 'per100k', 'newCaseCount'].forEach(value => {
        let  result = urlManager.parse(`http://dummy.com/#ranker/${value}`)
        expect(result).toEqual({ranker: value})
    })
})
test('url verticalScaleType ranker happyPath', () => {
    ['linear', 'logarithmic'].forEach(value => {
        let  result = urlManager.parse(`http://dummy.com/#verticalScaleType/${value}`)
        expect(result).toEqual({verticalScaleType: value})
    })
})

test('url parsing for problematic elements', () => {
    ['movingAvgStrategy', 'nullStrategy', 'dataLinesId', 'activeTab', 'ranker', 'verticalScaleType',
        'selectedRegions', 'dataFocus'].forEach(field => {
        ['', '/', '/illegalValue'].forEach(tail => {
            let  result = urlManager.parse(`http://dummy.com/#${field}${tail}`)
            expect(result).toEqual({})
        })
    })
})

test('url parsing with unrecognizedKey', () => {
    let result  = urlManager.parse("http://dummy.com/#foo/beta")

    expect(result).toEqual({})
})