import PropTypes from "prop-types";
import DataQualityAssessor from "../../covid_tracking_com/data_quality_assessor";
import {unique} from "../../util/unique";
import {STANDARD_DATA_PROPERTIES} from "../../covid_tracking_com/normalized_record_set";


let PROP_TYPES = {}

PROP_TYPES.QuickPick = PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    regions: PropTypes.arrayOf(PropTypes.string),
    regionsFilter: PropTypes.func
})
PROP_TYPES.RegionSpec = PropTypes.shape({
    singleNoun: PropTypes.string.isRequired,
    pluralNoun: PropTypes.string.isRequired,
    matrixMapRatio: PropTypes.arrayOf(PropTypes.number).isRequired,
    columns: PropTypes.number.isRequired,
    minimumCellWidth: PropTypes.number.isRequired,
    mapURI: PropTypes.string.isRequired,
    displayNameFor: PropTypes.func.isRequired,
    quickPicks: PropTypes.arrayOf(PROP_TYPES.QuickPick).isRequired,
})
PROP_TYPES.DataProvider = PropTypes.shape({
    getData: PropTypes.func.isRequired
})

PROP_TYPES.DataFocus = PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    regionSpec: PROP_TYPES.RegionSpec.isRequired,
    dataProvider: PROP_TYPES.DataProvider.isRequired,
    settingsKey: PropTypes.string.isRequired,
    footerLink: PropTypes.string.isRequired,
    footerText: PropTypes.string.isRequired,

})

PROP_TYPES.NormalizedRecord = PropTypes.shape({
    region: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    positive: PropTypes.number,
    death: PropTypes.number,
    hospitalized: PropTypes.number,
})

PROP_TYPES.NormalizedRecordSet = PropTypes.shape({
    error: PropTypes.string,
    records: PropTypes.arrayOf(PROP_TYPES.NormalizedRecord).isRequired,
    regions: PropTypes.arrayOf(PropTypes.string).isRequired,
    warningsByRegion: PropTypes.object.isRequired,

})
PROP_TYPES.DataFocusSettings = PropTypes.shape({
    selectedRegions : PropTypes.arrayOf(PropTypes.string).isRequired,
    userQuickPicks: PropTypes.arrayOf(PROP_TYPES.QuickPick).isRequired,
    nullStrategy: PropTypes.string.isRequired,
    movingAvgStrategy: PropTypes.number.isRequired,
    dataLinesId: PropTypes.string.isRequired,
    verticalScaleType: PropTypes.string.isRequired,
})

export default PROP_TYPES