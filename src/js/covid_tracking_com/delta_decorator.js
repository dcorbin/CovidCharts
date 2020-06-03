import copyData from "../util/copyData";

export default class DeltaDecorator {
    decorate(covid_records) {
        let result = copyData(covid_records)
        function delta(array, index, property) {
            if (index === 0)
                return null
            if (array[index - 1][property] === null)
                return null
            return array[index][property] - array[index - 1][property]
        }
        result.forEach((r, index, array) => {
            r.delta_hospitalized = delta(array, index, "hospitalized")
            r.delta_positive = delta(array, index, "positive")
            r.delta_death = delta(array, index, "death")
        })

        return result;
    }

}