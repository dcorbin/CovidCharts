export default class LocationManager {
    constructor(window) {
        this.window = window
    }

    getLocation() {
        return this.window.location.href
    }
    setLocation(url) {
        this.window.history.replaceState(null, '', url)
    }

}