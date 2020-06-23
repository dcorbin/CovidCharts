export default class RegionTrendCalculator {
    constructor() {
    }
    calculateTrend(boundaryRecords, avgPropertyName, propertyName) {
        let pastValue = boundaryRecords.from[avgPropertyName][propertyName];
        let currentValue = boundaryRecords.to[avgPropertyName][propertyName];
        if (pastValue === null || currentValue === null) {
            return {
                sevenDayAvg: null,
                delta: null,
                percentage: null,
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
        return {
            sevenDayAvg: sevenDayAvg,
            delta: delta,
            percentage: deltaPercentage,
        }

    }
}