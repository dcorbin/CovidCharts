export function createMappingComparator(mappingFunction, comparisonFunction = (a,b) => a-b) {
    return (a, b) => {
        const ap = mappingFunction(a)
        const bp = mappingFunction(b)
        return comparisonFunction(ap, bp)
    }
}

export function createReverseComparator(comparator) {
    return (a, b) => {
        let compareResult = comparator(a, b);
        if (compareResult === 0)
            return 0
        return -1 * compareResult
    }
}