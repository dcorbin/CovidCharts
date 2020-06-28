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
        let population = this.populationMap.get(boundaryRecords.to.region) || 0;
        return {
            sevenDayAvg: sevenDayAvg,
            delta: delta,
            percentage: deltaPercentage,
            newCasesPer100k: currentValue*100000/ population,
        }

    }
}