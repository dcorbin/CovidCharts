export default class ReadThroughCache {
    constructor(durationInMillis, clock, dataProvider) {
        this.durationInMillis = durationInMillis
        this.clock = clock
        this.dataProvider = dataProvider
    }

    getData() {
        if (this.clock.now > this.dataTimestamp + this.durationInMillis)  {
            this.data = null
        }

        if (this.data == null) {
            this.dataTimestamp = this.clock.now()
            this.data = this.dataProvider.getData()
        }
        return this.data
    }
}
