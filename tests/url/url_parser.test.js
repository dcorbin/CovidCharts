import {expect, jest} from "@jest/globals";
import UrlParser from "../../src/js/url/url_parser";

const population = new Map([['red', 3],['green', 4],[ 'blue', 5]]);
const focusList = [
    {key: 'alpha', name: 'Able'},
    {key: 'colors', name: 'Bob', populationMap: population},
    {key: 'gamma', name: 'Charlie'}]
let urlParser = new UrlParser(focusList)

test('url parsing dataFocus happyPath', () => {
    let  result = urlParser.parse("http://dummy.com/#dataFocus/colors")

    expect(result.dataFocus).toEqual(focusList[1])
})

test('url parsing selectedRegions happyPath', () => {
    let  result = urlParser.parse("http://dummy.com/#dataFocus/colors/selectedRegions/red,blue")

    expect(result.dataFocus).toEqual(focusList[1])
    expect(result.selectedRegions).toEqual(['red', 'blue'])
})

test('url parsing selectedRegions single', () => {
    let  result = urlParser.parse("http://dummy.com/#dataFocus/colors/selectedRegions/red")

    expect(result.dataFocus).toEqual(focusList[1])
    expect(result.selectedRegions).toEqual(['red'])
})
test('url parsing selectedRegions in the wrong order', () => {
    let  result = urlParser.parse("http://dummy.com/#selectedRegions/red/dataFocus/colors")

    expect(result.dataFocus).toEqual(focusList[1])
    expect(result.selectedRegions).toBeUndefined()
})
test('url parsing selectedRegions with No Regions', () => {
    let  result = urlParser.parse("http://dummy.com/#dataFocus/colors/selectedRegions/")

    expect(result.dataFocus).toEqual(focusList[1])
    expect(result.selectedRegions).toEqual([])
})

test('url parsing selectedRegions with no value given', () => {
    let  result = urlParser.parse("http://dummy.com/#dataFocus/colors/selectedRegions")

    expect(result.dataFocus).toEqual(focusList[1])
    expect(result.selectedRegions).toEqual([])
})

test('url parsing selectedRegions withSomeInvalid', () => {
    let  result = urlParser.parse("http://dummy.com/#dataFocus/colors/selectedRegions/red,square")

    expect(result.dataFocus).toEqual(focusList[1])
    expect(result.selectedRegions).toEqual(['red'])
})

test('url parsing nullStrategy happyPath', () => {
    ['none','leadingNullAsZero'].forEach(value => {
        let  result = urlParser.parse(`http://dummy.com/#nullStrategy/${value}`)
        expect(result).toEqual({nullStrategy: value})
    })
})
test('url parsing movingAvgStrategy happyPath', () => {
    [1, 3, 7, 14].forEach(value => {
        let  result = urlParser.parse(`http://dummy.com/#movingAvgStrategy/${value}`)
        expect(result).toEqual({movingAvgStrategy: value})
    })
})
test('url parsing dataLinesId happyPath', () => {
    ['ALL', 'positive', 'death', 'hospitalized'].forEach(value => {
        let  result = urlParser.parse(`http://dummy.com/#dataLinesId/${value}`)
        expect(result).toEqual({dataLinesId: value})
    })
})
test('url parsing activeTab happyPath', () => {
    [0, 1].forEach(value => {
        let  result = urlParser.parse(`http://dummy.com/#activeTab/${value}`)
        expect(result).toEqual({activeTab: value})
    })
})
test('url parsing ranker happyPath', () => {
    ['rate', 'per100k', 'newCaseCount'].forEach(value => {
        let  result = urlParser.parse(`http://dummy.com/#ranker/${value}`)
        expect(result).toEqual({ranker: value})
    })
})
test('url verticalScaleType ranker happyPath', () => {
    ['linear', 'logarithmic'].forEach(value => {
        let  result = urlParser.parse(`http://dummy.com/#verticalScaleType/${value}`)
        expect(result).toEqual({verticalScaleType: value})
    })
})

test('url parsing for problematic elements', () => {
    ['movingAvgStrategy', 'nullStrategy', 'dataLinesId', 'activeTab', 'ranker', 'verticalScaleType',
        'selectedRegions', 'dataFocus'].forEach(field => {
        ['', '/', '/illegalValue'].forEach(tail => {
            let  result = urlParser.parse(`http://dummy.com/#${field}${tail}`)
            expect(result).toEqual({})
        })
    })
})

test('url parsing with unrecognizedKey', () => {
    let result  = urlParser.parse("http://dummy.com/#foo/beta")

    expect(result).toEqual({})
})