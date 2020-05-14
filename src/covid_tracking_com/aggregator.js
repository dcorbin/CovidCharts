import onlyUnique from "../util/unique";

export default class Aggregator {
    aggregate(records) {
        return records.map(r => r.date).
                filter(onlyUnique).
                map(date => {
                    function addRecords(accumulator, currentValue) {
                        function addValue(parent, accumulator, currentValue, property) {
                            function isNumber(n) {
                                return !(typeof n === 'undefined' || n == null || isNaN(n))
                            }
                            
                            if (!isNumber(accumulator[property]) ) {
                                parent[property] = currentValue[property]
                                return
                            }

                            if (isNumber(accumulator[property]) && isNumber(currentValue[property])) {
                                parent[property] = accumulator[property] + currentValue[property]
                            } else {
                                parent[property] = accumulator[property]
                            }
                        }

                        let result = {
                            date: date
                        }
                        addValue(result, accumulator, currentValue, 'hospitalized')
                        addValue(result, accumulator, currentValue, 'death')
                        addValue(result, accumulator, currentValue, 'positive')
                        return result
                    }
                    let zero = {}
                    return records.filter(r => r.date === date).reduce(addRecords, zero)
                })
    }
}