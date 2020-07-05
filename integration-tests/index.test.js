import {expect, jest} from "@jest/globals";
import DATA_FOCUS_LIST from "../src/js/model/data_focus";
import AppBootstrapper from "../src/js/app_bootstrapper";
jest.mock("../src/js/app_bootstrapper")

import SettingsManager from "../src/js/settings_manager"
jest.mock("../src/js/settings_manager")

function invokeIndex() {
    document.body.innerHTML = '<div id="app"/>'

    require("../src/js/index.js")

    window.onload(new Event("load"))
}

test('Test index', () => {
    const sm = 'sm'
    SettingsManager.create.mockReturnValue(sm)

    invokeIndex();

    const appElement = document.getElementById('app');
    expect(AppBootstrapper).toHaveBeenCalledTimes(1)
    expect(AppBootstrapper).toHaveBeenCalledWith(appElement, sm)
    expect(SettingsManager.create).toHaveBeenCalledTimes(1)
    expect(SettingsManager.create).toHaveBeenCalledWith(DATA_FOCUS_LIST, window.localStorage)
    let mockBootstrapper = AppBootstrapper.mock.instances[0]
    expect(mockBootstrapper.run).toHaveBeenCalledTimes(1)
    expect(mockBootstrapper.run).toHaveBeenCalledWith()
})


