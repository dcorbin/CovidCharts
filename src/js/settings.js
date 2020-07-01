import QuickPick from "./model/quick_pick";
export function normalizeDataFocusTabSettings(dataFocusSettings, outdatedSelectionPropertyName = null) {
    if (outdatedSelectionPropertyName && dataFocusSettings[outdatedSelectionPropertyName]) {
        dataFocusSettings.selectedRegions = dataFocusSettings[outdatedSelectionPropertyName]
        delete dataFocusSettings[outdatedSelectionPropertyName]
    }

    if (!dataFocusSettings.selectedRegions)
        dataFocusSettings.selectedRegions = []

    if (!dataFocusSettings.userQuickPicks)
        dataFocusSettings.userQuickPicks = []
    else {
        dataFocusSettings.userQuickPicks = dataFocusSettings.userQuickPicks.map(qpo => {
            return QuickPick.fromGenericObject(qpo);
        })
    }

    if (!dataFocusSettings.nullStrategy) {
        dataFocusSettings.nullStrategy = 'none'
    }
    if (!dataFocusSettings.movingAvgStrategy) {
        dataFocusSettings.movingAvgStrategy = 7
    }
    if (!dataFocusSettings.dataLinesId) {
        dataFocusSettings.dataLinesId = 'ALL'
    }
    if (!dataFocusSettings.verticalScaleType) {
        dataFocusSettings.verticalScaleType = 'linear'
    }
    if (!dataFocusSettings.activeTab) {
        dataFocusSettings.activeTab = 0
    }
    if (!dataFocusSettings.ranker) {
        dataFocusSettings.ranker = 'rate'
    }
    dataFocusSettings.selectedRegions = dataFocusSettings.selectedRegions.filter(e => e !== null)
    return dataFocusSettings
}

export class Settings {
    static defaultFocusSettings(regions) {
        return normalizeDataFocusTabSettings({
            selectedRegions: regions
        })
    }
    static defaultSettings() {
        return new Settings(
                Settings.defaultFocusSettings(['GA']),
                Settings.defaultFocusSettings([])
        )
    }

    constructor(covidTracking, georgia) {
        this.covidTracking = covidTracking
        this.georgia = georgia
    }
}


