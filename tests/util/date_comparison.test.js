import {expect} from "@jest/globals";
import {datesAreEqual} from "../../src/util/date_comparison";

test('datesAreEqual', () => {
    expect(datesAreEqual(new Date(2020, 4,13), new Date(2020,4,13))).toEqual(true)
    expect(datesAreEqual(new Date(2020, 4,14), new Date(2020,4,13))).toEqual(false)
})