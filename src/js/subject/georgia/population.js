import GeorgiaPopulation from '../../../json/population/GA.json'
export const GA_POPULATION = normalizeGaData(GeorgiaPopulation)
function normalizeGaData(json) {
    return json.data.reduce((result, countyRecord) => {
        result.set(countyRecord.CTYNAME.replace(' County', ''), countyRecord.Pop)
        return result
    }, new Map())
}
