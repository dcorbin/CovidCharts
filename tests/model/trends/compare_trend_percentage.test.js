import {expect} from "@jest/globals";
import compareTrendPercentage from "../../../src/js/model/trends/compare_trend_percentge";

test('compareTrendPercentage', () => {
    expect(compareTrendPercentage(3, 4)).toBe(-1)
    expect(compareTrendPercentage(-3, 4)).toBe(-1)
    expect(compareTrendPercentage(-Infinity, 4)).toBe(-1)
    expect(compareTrendPercentage(-Infinity, Infinity)).toBe(-1)
    expect(compareTrendPercentage(4, Infinity, )).toBe(-1)
    expect(compareTrendPercentage(null, 4)).toBe(-1)
    expect(compareTrendPercentage(null, -4)).toBe(-1)
    expect(compareTrendPercentage(null,   Infinity )).toBe(-1)
    expect(compareTrendPercentage(null,   -Infinity )).toBe(-1)

    expect(compareTrendPercentage(4, 3)).toBe(1)
    expect(compareTrendPercentage(4,   -3, )).toBe(1)
    expect(compareTrendPercentage(4, -Infinity, )).toBe(1)
    expect(compareTrendPercentage(Infinity, 4)).toBe(1)
    expect(compareTrendPercentage(Infinity, -Infinity)).toBe(1)
    expect(compareTrendPercentage(4, null)).toBe(1)
    expect(compareTrendPercentage(-4, null)).toBe(1)
    expect(compareTrendPercentage(Infinity, null, )).toBe(1)
    expect(compareTrendPercentage(-Infinity, null, )).toBe(1)

    expect(compareTrendPercentage(Infinity, Infinity, )).toBe(0)
    expect(compareTrendPercentage(-Infinity, -Infinity, )).toBe(0)
    expect(compareTrendPercentage(null, null, )).toBe(0)


    expect([3.1, null, -2.5, Infinity, -Infinity].sort(compareTrendPercentage)).
        toEqual([null, -Infinity, -2.5, 3.1, Infinity])
})
