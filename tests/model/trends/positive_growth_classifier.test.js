import {expect} from "@jest/globals";
import PositiveGrowthClassifier from "../../../src/js/model/trends/postiive_growth_classirifer";

let classifier = new PositiveGrowthClassifier()

function verifyPercentagesYieldClassName(percentages, className) {
    percentages.forEach(percentage => {
        expect(classifier.categoryClassName(percentage)).toBe(className)
    })
}
test('bad3', () => {
    verifyPercentagesYieldClassName([Infinity, 700, 100], 'bad3');
})
test('bad2', () => {
    verifyPercentagesYieldClassName([99.99, 50], 'bad2');
})
test('bad1', () => {
    verifyPercentagesYieldClassName([49.99, 10], 'bad1');
})
test('zero is neutral', () => {
    verifyPercentagesYieldClassName([0, -9.99, 9.99], 'neutral');
})
test('good1', () => {
    verifyPercentagesYieldClassName([-49.99, -10], 'good1');
})
test('good2', () => {
    verifyPercentagesYieldClassName([-50, -99.99], 'good2');
})
test('good3', () => {
    verifyPercentagesYieldClassName([-100], 'good3');
})

test('good3', () => {
    verifyPercentagesYieldClassName([-Infinity], 'allClear');
})

test('problem child', () => {
    verifyPercentagesYieldClassName([null, NaN], 'dataOddity');
})

