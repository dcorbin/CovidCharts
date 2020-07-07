import {beforeEach, expect, jest} from "@jest/globals";
import {cloneDeep} from 'lodash'
import UrlManager from "../../src/js/url/url_manager";

import UrlParser from "../../src/js/url/url_parser";
jest.mock( "../../src/js/url/url_parser")

import LocationManager from '../../src/js/web/location_manager'
jest.mock('../../src/js/web/location_manager')
const population = new Map([['red', 3],['green', 4],[ 'blue', 5]]);
const colorDataFocus = {settingsKey: 'colors', name: 'Colors', populationMap: population, key: 'kColor'};
const shapeDataFocus = {settingsKey: 'shapes', name: 'Shapes', key: 'kShape'};
const focusList = [
    shapeDataFocus,
    colorDataFocus,
]
const locationManager = new LocationManager()
const urlParser = new UrlParser();
const urlManager = new UrlManager(urlParser, locationManager)
const appSettings = {
    dataFocus: shapeDataFocus,
    settings: {
        colors: {
            nullStrategy: 'none',
            movingAvgStrategy:  14,
            activeTab:  1,
            dataLinesId: 'All',
            ranker: 'rate',
            verticalScaleType: 'linear',
            selectedRegions: ['green, blue']
        },
        shapes: {
            nullStrategy: 'none',
            movingAvgStrategy:  7,
            activeTab:  1,
            dataLinesId: 'All',
            ranker: 'rate',
            verticalScaleType: 'linear',
            selectedRegions: ['circle']
        }
    }
}

beforeEach(() => {
    urlParser.parse.mockClear()
})
test('url merging parseResults with appSettings (covering all fields)', () => {
    urlParser.parse.mockReturnValue({
        dataFocus: colorDataFocus,
        nullStrategy: 'null2',
        movingAvgStrategy:  9,
        activeTab:  0,
        dataLinesId: 'Some',
        ranker: 'rated-x',
        verticalScaleType: 'linear2',
        selectedRegions: ['green','red']
    })


    const url = `http://dummy.com/#dataFocus/foo`;

    let  newAppSettings  = urlManager.settingsAdjustedForUrl(appSettings, url)

    expect(urlParser.parse).toHaveBeenCalledWith(url)
    expect(newAppSettings.dataFocus).toEqual(colorDataFocus)
    expect(newAppSettings.settings.shapes).toEqual(appSettings.settings.shapes)
    expect(newAppSettings.settings.colors).toEqual({
        nullStrategy: 'null2',
        movingAvgStrategy:  9,
        activeTab:  0,
        dataLinesId: 'Some',
        ranker: 'rated-x',
        verticalScaleType: 'linear2',
        selectedRegions: ['green', 'red']
    })
})
test('url merging parseResults with appSettings when parse results are less', () => {
    urlParser.parse.mockReturnValue({
        dataFocus: colorDataFocus,
        nullStrategy: 'null2',
    })

    const url = `http://dummy.com/#dataFocus/foo/color/fred`;

    let newAppSettings = urlManager.settingsAdjustedForUrl(appSettings, url)

    expect(urlParser.parse).toHaveBeenCalledWith(url)
    expect(newAppSettings.dataFocus).toEqual(colorDataFocus)
    expect(newAppSettings.settings.shapes).toEqual(appSettings.settings.shapes)
    expect(newAppSettings.settings.colors).toEqual({
        nullStrategy: 'null2',
        movingAvgStrategy: 14,
        activeTab: 1,
        dataLinesId: 'All',
        ranker: 'rate',
        verticalScaleType: 'linear',
        selectedRegions: ['green, blue']
    })
})
test('url merging parseResults with appSettings when dataFocusNotIncluded', () => {
    urlParser.parse.mockReturnValue({
        nullStrategy: 'null2',
    })

    const url = `http://dummy.com/#dataFocus/foo/color/fred`;

    let  newAppSettings  = urlManager.settingsAdjustedForUrl(appSettings, url)

    expect(urlParser.parse).toHaveBeenCalledWith(url)
    expect(newAppSettings).toEqual(appSettings)
})
test('testUrlCreationFor Tab 1', () => {
    locationManager.getLocation.mockReturnValue('http://dummy.com/foo/bar')
    let testInput = cloneDeep(appSettings)
    testInput.settings.shapes = {
                nullStrategy: 'none',
                movingAvgStrategy:  7,
                activeTab:  1,
                dataLinesId: 'All',
                ranker: 'rate',
                verticalScaleType: 'linear',
                selectedRegions: ['circle']
            }
    const url = urlManager.buildUrl(testInput)

    expect(url).toEqual("http://dummy.com/#dataFocus/kShape/activeTab/1/ranker/rate")
})

test('testUrlCreationFor Tab 0', () => {
    locationManager.getLocation.mockReturnValue('http://dummy.com/foo/bar')
    let testInput = cloneDeep(appSettings)
    testInput.settings.shapes = {
        activeTab: 0 ,
        ranker: 'rate',
        dataLinesId: 'All',
        movingAvgStrategy:  7,
        nullStrategy: 'none',
        selectedRegions: ['circle', 'square'],
        verticalScaleType: 'linear'
    }
    const url = urlManager.buildUrl(testInput)

    expect(url).toEqual("http://dummy.com/#dataFocus/kShape/activeTab/0/" +
        "dataLinesId/All/movingAvgStrategy/7/nullStrategy/none/selectedRegions/circle,square/verticalScaleType/linear")
})