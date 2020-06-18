import BoundaryFinder from "../../../src/js/model/trends/boundary_finder";
import {expect} from "@jest/globals";

let records = [
    {date: new Date(2020, 5, 12), data: 5},
    {date: new Date(2020, 5,  8), data: 1},
    {date: new Date(2020, 5,  9), data: 2},
    {date: new Date(2020, 5, 11), data: 4},
    {date: new Date(2020, 5, 13), data: 6},
    {date: new Date(2020, 5, 17), data: 10},
    {date: new Date(2020, 5, 14), data: 7},
    {date: new Date(2020, 5, 10), data: 3},
    {date: new Date(2020, 5, 15), data: 8},
    {date: new Date(2020, 5, 16), data: 9},
]


test('findBoundaryRecords 7', () => {
    let finder = new BoundaryFinder(7)

    let boundaryRecords = finder.findBoundaryRecords(records)

    expect(boundaryRecords.from.data).toBe(3)
    expect(boundaryRecords.to.data).toBe(10)
})
test('findBoundaryRecords 5', () => {
    let finder = new BoundaryFinder(5)

    let boundaryRecords = finder.findBoundaryRecords(records)

    expect(boundaryRecords.from.data).toBe(5)
    expect(boundaryRecords.to.data).toBe(10)
})

test('findBoundaryRecords without Adequate Data', () => {
    let finder = new BoundaryFinder(14)

    let boundaryRecords = finder.findBoundaryRecords(records)

    expect(boundaryRecords.from).toBe(null)
    expect(boundaryRecords.to.data).toBe(10)
})