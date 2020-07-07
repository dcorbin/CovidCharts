import LocationManager from "../../src/js/web/location_manager"
import {expect} from "@jest/globals";
test('Test LocationManager', () => {
    const window = {
        location: { href: '' },
        history: {
        }
    }
    window.history.replaceState = function(arg1, title, url) {
        window.location.href = url
    }
    let manager = new LocationManager(window)

    const url1 = 'https://dummy.com/#foo'
    const url2 = 'http://dummy.com/#bar'

    window.location.href = url1

    expect(manager.getLocation()).toEqual(url1)

    manager.setLocation(url2)

    expect(manager.getLocation()).toEqual(url2)
})


