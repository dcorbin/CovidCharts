export default class RegionTrendCalculator {
    constructor() {
    }
    calculateTrend(boundaryRecords, avgPropertyName, propertyName) {
        function magnitude(n) {
            if (magnitude === 0)
                return 0
            return String(Math.abs(n).toFixed(0)).length
        }
        let pastValue = boundaryRecords.from[avgPropertyName][propertyName];
        let currentValue = boundaryRecords.to[avgPropertyName][propertyName];
        if (pastValue === null || currentValue === null) {
            return {
                currentValue: null,
                delta: null,
                percentage: null,
                sevenFourteen: null,
                sevenFourteenPercentage: null,
                dangerScore: null,
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
        let fourteenDayAvg = boundaryRecords.to.fourteenDayAvg[propertyName];
        let sevenDayAvg = boundaryRecords.to.sevenDayAvg[propertyName];
        if (sevenDayAvg === 0 && fourteenDayAvg === 0) {
            return {
                sevenDayAvg: sevenDayAvg,
                delta: null,
                percentage: null,
                sevenFourteen: null,
                sevenFourteenPercentage: null,
                dangerScore: null,
            }
        }
        console.log(`${boundaryRecords.to.region}: 7: ${sevenDayAvg}; 14: ${fourteenDayAvg}`)
        let sevenFourteen = sevenDayAvg - fourteenDayAvg;
        let currentMagnitude = magnitude(sevenDayAvg);
        return {
            sevenDayAvg: sevenDayAvg,
            delta: delta,
            percentage: deltaPercentage,
            sevenFourteen: sevenFourteen,
            sevenFourteenPercentage: sevenFourteen/fourteenDayAvg,
            dangerScore: sevenFourteen/fourteenDayAvg * currentMagnitude * currentMagnitude
        }

    }
}