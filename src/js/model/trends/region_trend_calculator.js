export default class RegionTrendCalculator {
    constructor() {
    }
    calculateTrend(boundaryRecords, propertyName) {
        let pastValue = boundaryRecords.from.nDayAverages[propertyName];
        let currentValue = boundaryRecords.to.nDayAverages[propertyName];
        if (pastValue === null || currentValue === null) {
            return {
                currentValue: boundaryRecords.to[propertyName],
                delta: null,
                percentage: null
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
        return {
            currentValue: boundaryRecords.to[propertyName],
            delta: delta,
            percentage: deltaPercentage
        }

    }
}