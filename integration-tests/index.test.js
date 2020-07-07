import {expect, jest} from "@jest/globals";
import DATA_FOCUS_LIST from "../src/js/model/data_focus";
import AppBootstrapper from "../src/js/app_bootstrapper";
import SettingsManager from "../src/js/settings_manager"
import UrlParser from "../src/js/url/url_parser";
import UrlManager from "../src/js/url/url_manager";
import location from "../src/js/web/location";

jest.mock("../src/js/app_bootstrapper")

jest.mock("../src/js/settings_manager")

jest.mock("../src/js/url/url_parser")

jest.mock("../src/js/url/url_manager")

jest.mock("../src/js/web/location")

function invokeIndex() {
    document.body.innerHTML = '<div id="app"/>'

    require("../src/js/index.js")

    window.onload(new Event("load"))
}

test('Test index', () => {
    const settingsManager = 'sm'
    SettingsManager.create.mockReturnValue(settingsManager)

    invokeIndex();

    const appElement = document.getElementById('app');
    expect(AppBootstrapper).toHaveBeenCalledTimes(1)
    expect(AppBootstrapper).toHaveBeenCalledWith(
        appElement,
        settingsManager,
        UrlManager.mock.instances[0])

    expect(UrlManager).toHaveBeenCalledTimes(1)
    expect(UrlManager).toHaveBeenCalledWith(UrlParser.mock.instances[0], location)

    expect(UrlParser).toHaveBeenCalledTimes(1)
    expect(UrlParser).toHaveBeenCalledWith(DATA_FOCUS_LIST)

    expect(SettingsManager.create).toHaveBeenCalledTimes(1)
    expect(SettingsManager.create).toHaveBeenCalledWith(DATA_FOCUS_LIST, window.localStorage)

    let mockBootstrapper = AppBootstrapper.mock.instances[0]
    expect(mockBootstrapper.run).toHaveBeenCalledTimes(1)
    expect(mockBootstrapper.run).toHaveBeenCalledWith()
})


