import {expect, jest} from "@jest/globals";
import DATA_FOCUS_LIST from "../src/js/model/data_focus";
import AppBootstrapper from "../src/js/app_bootstrapper";
jest.mock("../src/js/app_bootstrapper")

import SettingsStore from "../src/js/settings_store";
jest.mock('../src/js/settings_store');

function invokeIndex() {
    document.body.innerHTML = '<div id="app"/>'

    require("../src/js/index.js")

    window.onload(new Event("load"))
}

test('Test index', () => {
    invokeIndex();

    const appElement = document.getElementById('app');
    expect(AppBootstrapper).toHaveBeenCalledTimes(1)
    expect(SettingsStore).toHaveBeenCalledTimes(1)
    expect(SettingsStore).toHaveBeenCalledWith(window.localStorage)
    expect(AppBootstrapper).toHaveBeenCalledWith(SettingsStore.mock.instances[0], DATA_FOCUS_LIST, appElement)
    let mockBootstrapper = AppBootstrapper.mock.instances[0]
    expect(mockBootstrapper.run).toHaveBeenCalledTimes(1)
    expect(mockBootstrapper.run).toHaveBeenCalledWith()
})


