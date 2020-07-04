import {beforeEach, expect, jest} from "@jest/globals";
import DATA_FOCUS_LIST from "../src/js/model/data_focus";

import persistentStateLoader from '../src/js/storage_util'
jest.mock('../src/js/storage_util')


import SettingsStore from "../src/js/settings_store";
jest.mock('../src/js/settings_store');
let mockSettingsStore = {
    load: jest.fn().mockName('SettingsStore#load'),
    store: jest.fn().mockName('SettingsStore#store')
}
SettingsStore.mockImplementation(() => mockSettingsStore)

import App from '../src/js/app'
import {Settings} from "../src/js/settings";
import AppBootstrapper from "../src/js/app_bootstrapper";
jest.mock('../src/js/app')
App.mockReturnValue('DIV')

beforeEach(() => {
    mockSettingsStore.store.mockClear()
    mockSettingsStore.load.mockClear()
});

function invokeIndex() {

    document.body.innerHTML = '<div id="app"/>'

    require("../src/js/index.js")
    persistentStateLoader.mockReturnValue('covidTracking.com')

    window.onload(new Event("load"))
}

function assertContentWasRendered() {
    const appDiv = document.getElementById("app")
    expect(appDiv.innerHTML).toEqual("DIV")
}

function extractProps() {
    expect(App.mock.instances.length).toEqual(1);
    const calls = App.mock.calls[0];
    expect(calls.length).toEqual(2);
    return calls[0];
}


test('Test Index when there are settings set', () => {
    const storedSettings = {
        'foo': 'bar'
    }

    mockSettingsStore.load.mockReturnValue(storedSettings)

    invokeIndex();

    assertContentWasRendered();
    const props = extractProps();
    expect(props.initialDataFocus).toBe(DATA_FOCUS_LIST[0])
    expect(props.initialSettings).toMatchObject(storedSettings)

    expect(mockSettingsStore.store.mock.calls.length).toEqual(0)

    const newSettings = {'newSetting': 'alpha'};
    props.saveSettings(newSettings)

    expect(mockSettingsStore.store.mock.calls).toEqual([[newSettings]])
})
//
// test('Test Index when there are NO settings set', () => {
//     const defaultSettings = Settings.defaultSettings()
//
//     mockSettingsStore.load.mockReturnValue(null)
//
//     invokeIndex();
//
//     assertContentWasRendered();
//     const props = extractProps();
//     expect(props.initialDataFocus).toBe(DATA_FOCUS_LIST[0])
//     expect(props.initialSettings).toMatchObject(defaultSettings)
//
//     expect(mockSettingsStore.store.mock.calls).toEqual([[defaultSettings]])
// })

