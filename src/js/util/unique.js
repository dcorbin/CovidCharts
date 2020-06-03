export default function onlyUnique(value, index, self) {
    let indexOf = self.indexOf(value);
    return indexOf === index;
}
export function unique(array, comparisonFunction = (a,b) => a === b) {
    let result = []
    array.forEach(item => {
        if (result.some(r => {
            return comparisonFunction(item, r);
        })) {
            return
        }
        result.push(item)
    })
    return result
}