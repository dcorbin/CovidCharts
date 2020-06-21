import {expect} from "@jest/globals";
import RegionTrendCalculator from "../../../src/js/model/trends/region_trend_calculator";

let boundaryRecords = {
    from: {
        deltaAlpha: 55,
        deltaBeta: 99,
        nDayAverages: {deltaAlpha: 50, deltaBeta: 9},
    },
    to: {
        deltaAlpha: 75,
        deltaBeta: 99,
        nDayAverages: {deltaAlpha: 60, deltaBeta: 9},
    }
}
let calculator = new RegionTrendCalculator()


test('calculate simple trend', () => {
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(20)
    expect(trend.delta).toBe(10)
    expect(trend.sevenDayAvg).toBe(75)
})

test('calculate flat trend', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = boundaryRecords.to.nDayAverages.deltaAlpha

    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(0)
    expect(trend.delta).toBe(0)
    expect(trend.sevenDayAvg).toBe(75)
})
test('calculate negative trend', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = 120
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(-50)
    expect(trend.delta).toBe(-60)
    expect(trend.sevenDayAvg).toBe(75)
})

test('calculate from 0', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = 0
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(Infinity)
    expect(trend.delta).toBe(60)
    expect(trend.sevenDayAvg).toBe(75)
})

test('calculate from 0 to 0', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = 0
    boundaryRecords.to.nDayAverages.deltaAlpha = 0
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(- Infinity)
    expect(trend.delta).toBe(0)
    expect(trend.sevenDayAvg).toBe(75)
})

test('test when to value is negative', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = 0
    boundaryRecords.to.nDayAverages.deltaAlpha = -1
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(-1)
    expect(trend.sevenDayAvg).toBe(75)
})

test('test when from value is negative', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = -1
    boundaryRecords.to.nDayAverages.deltaAlpha = 0
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(1)
    expect(trend.sevenDayAvg).toBe(75)
})

test('test when both values are negative', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = -1
    boundaryRecords.to.nDayAverages.deltaAlpha = -1
    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(0)
    expect(trend.sevenDayAvg).toBe(75)
})

test('test when from value is missing', () => {
    boundaryRecords.from.nDayAverages.deltaAlpha = null

    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(null)
    expect(trend.sevenDayAvg).toBe(75)
})
test('test when to value is missing', () => {
    boundaryRecords.to.nDayAverages.deltaAlpha = null

    let trend = calculator.calculateTrend(boundaryRecords, "deltaAlpha")

    expect(trend.percentage).toBe(null)
    expect(trend.delta).toBe(null)
    expect(trend.sevenDayAvg).toBe(75)
})
