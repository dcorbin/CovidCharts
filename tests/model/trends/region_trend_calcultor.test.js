import {expect} from "@jest/globals";
import RegionTrendCalculator from "../../../src/js/model/trends/region_trend_calculator";

let boundaryRecords = {
    from: {
        deltaAlpha: 55,
        deltaBeta: 99,
        sevenDayAvg: {deltaAlpha: 50, deltaBeta: 9},
        region: 'alpha'
    },
    to: {
        deltaAlpha: 75,
        deltaBeta: 99,
        sevenDayAvg: {deltaAlpha: 60, deltaBeta: 9},
        region: 'alpha'
    }
}

let populationMap = new Map()
populationMap.set('alpha', 1000 * 1000)
let calculator = new RegionTrendCalculator(populationMap)

test('calculate simple trend', () => {
    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(20)
    expect(trend.delta).toBe(10)
    expect(trend.sevenDayAvg).toBe(60)
    expect(trend.newCasesPer100k).toBe(6)
})

test('calculate flat trend', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = boundaryRecords.to.sevenDayAvg.deltaAlpha

    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(0)
    expect(trend.delta).toBe(0)
    expect(trend.sevenDayAvg).toBe(60)
    expect(trend.newCasesPer100k).toBe(6)
})
test('calculate negative trend', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = 120
    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(-50)
    expect(trend.delta).toBe(-60)
    expect(trend.sevenDayAvg).toBe(60)
    expect(trend.newCasesPer100k).toBe(6)
})

test('calculate from 0', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = 0
    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(Infinity)
    expect(trend.delta).toBe(60)
    expect(trend.sevenDayAvg).toBe(60)
    expect(trend.newCasesPer100k).toBe(6)
})

test('calculate from 0 to 0', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = 0
    boundaryRecords.to.sevenDayAvg.deltaAlpha = 0

    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(- Infinity)
    expect(trend.delta).toBe(0)
    expect(trend.sevenDayAvg).toBe(0)
    expect(trend.newCasesPer100k).toBe(0)

})

test('test when to value is negative', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = 0
    boundaryRecords.to.sevenDayAvg.deltaAlpha = -1
    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(-1)
    expect(trend.sevenDayAvg).toBe(-1)
    expect(trend.newCasesPer100k).toBe(-0.1)
})

test('test when from value is negative', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = -1
    boundaryRecords.to.sevenDayAvg.deltaAlpha = 0
    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(1)
    expect(trend.sevenDayAvg).toBe(0)
    expect(trend.newCasesPer100k).toBe(0)
})

test('test when both values are negative', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = -1
    boundaryRecords.to.sevenDayAvg.deltaAlpha = -1
    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(0)
    expect(trend.sevenDayAvg).toBe(-1)
    expect(trend.newCasesPer100k).toBe(-0.1)

})

test('test when from value is missing', () => {
    boundaryRecords.from.sevenDayAvg.deltaAlpha = null

    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(null)
    expect(trend.sevenDayAvg).toBe(null)
    expect(trend.newCasesPer100k).toBe(null)
})
test('test when to value is missing', () => {
    boundaryRecords.to.sevenDayAvg.deltaAlpha = null

    let trend = calculator.calculateTrend(boundaryRecords, 'sevenDayAvg', "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(null)
    expect(trend.sevenDayAvg).toBe(null)
    expect(trend.newCasesPer100k).toBe(null)
})
