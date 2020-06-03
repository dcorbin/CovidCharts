import {expect} from "@jest/globals";
import onlyUnique, {unique} from "../../src/js/util/unique";
import {datesAreEqual} from "../../src/js/util/date_comparison";

test('uniqueWithDatesAndCompFunction', () => {
    let date1a = new Date(2020, 4, 1);
    let date1b = new Date(2020, 4, 1);

    let dates = [date1a, date1b]
    let uniqueDates = unique(dates, datesAreEqual )

    expect(uniqueDates).toEqual([
        date1a
    ])
   expect(uniqueDates).toEqual([
        date1b
    ])
})

test('unique values', () => {
    let input = unique(["A", "B", "A", "C", "D", "D"])

    expect(input).toEqual([ "A", "B", "C", "D"])
})