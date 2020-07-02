// 9664.143 peak NY APR 10
// NY Pop
// NY Peak/100k 4.971147043829035
export const NEW_YORK_REF_PER100k = 4.971147043829035
export default class RegionTrendCalculator {
    constructor(populationMap) {
        this.populationMap = populationMap
    }
    calculateTrend(boundaryRecords, avgPropertyName, propertyName) {
        let pastValue = boundaryRecords.from[avgPropertyName][propertyName];
        let currentValue = boundaryRecords.to[avgPropertyName][propertyName];
        if (pastValue === null || currentValue === null) {
            return {
                sevenDayAvg: null,
                delta: null,
                percentage: null,
                newCasesPer100k: null,
                perCapitaRelatedToNY: null
            }
        }
        let delta = currentValue - pastValue;

        let deltaPercentage = delta/pastValue*100;
        if (0 > currentValue || 0 > pastValue) {
            deltaPercentage = null
        }
        if (currentValue === 0 && pastValue === 0) {
            deltaPercentage = - Infinity
        }
        let sevenDayAvg = boundaryRecords.to.sevenDayAvg[propertyName];
        let population = this.populationMap.get(boundaryRecords.to.region) || NaN
        const newCasesPer100k = sevenDayAvg*100000/ population;
        return {
            percentage: deltaPercentage,
            delta: delta,
            sevenDayAvg: sevenDayAvg,
            newCasesPer100k: newCasesPer100k,
            perCapitaRelatedToNY: newCasesPer100k/NEW_YORK_REF_PER100k * 100
        }

    }
}