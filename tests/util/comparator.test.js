import {expect, jest} from "@jest/globals";
import {createMappingComparator, createReverseComparator} from "../../src/js/util/comparator";

test('createReverseComparator', () => {
    const comparator = jest.fn().mockName('comparator')
    let reverseComparator = createReverseComparator(comparator)
    comparator.mockReturnValueOnce(0).mockReturnValueOnce(-1).mockReturnValueOnce(1)

    expect(reverseComparator("A", "B")).toEqual(0)
    expect(reverseComparator("A", "B")).toEqual(1)
    expect(reverseComparator("A", "B")).toEqual(-1)
    expect(comparator.mock.calls).toEqual([["A", "B"], ["A", "B"], ["A", "B"]])
})

test('createMappingComparator', () => {
    const comparator = jest.fn().mockName('comparator')
    const mapper = jest.fn().mockName('mapper')
    let mappingComparator = createMappingComparator(mapper, comparator)
    mapper.mockReturnValueOnce('AA').mockReturnValueOnce('BB').
        mockReturnValueOnce('CC').mockReturnValueOnce('DD').
        mockReturnValueOnce('EE').mockReturnValueOnce('FF')

    comparator.mockReturnValueOnce(0).mockReturnValueOnce(-1).mockReturnValueOnce(1)

    expect(mappingComparator("A", "B")).toEqual(0)
    expect(mappingComparator("A", "B")).toEqual(-1)
    expect(mappingComparator("A", "B")).toEqual(1)

    expect(comparator.mock.calls).toEqual([["AA", "BB"], ["CC", "DD"], ["EE", "FF"]])

})