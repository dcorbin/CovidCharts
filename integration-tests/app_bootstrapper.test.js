import {beforeEach, expect, jest} from "@jest/globals";

import SettingsManager from  '../src/js/settings_manager'
jest.mock('../src/js/settings_manager' );

import UrlManager from "../src/js/url/url_manager";
jest.mock("../src/js/url/url_manager")

import LocationManager from "../src/js/web/location_manager"
jest.mock("../src/js/web/location_manager")

import App from '../src/js/app'
jest.mock('../src/js/app')

import AppBootstrapper from "../src/js/app_bootstrapper";
import React from "react";
App.mockReturnValue('DIV')

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
    document.body.innerHTML = '<div id="app"/>'
    const settingsManager = new SettingsManager();
    const urlManager = new UrlManager()
    const locationManager = new LocationManager()
    const appBootstrapper = new AppBootstrapper(document.getElementById("app"),
        settingsManager, urlManager, locationManager);

    appBootstrapper.run()

    assertContentWasRendered();
    const props = extractProps();
    expect(props).toEqual({
        settingsManager: settingsManager,
        urlManager: urlManager,
        locationManager: locationManager,
    })
})

