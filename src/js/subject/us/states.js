import {US_URL} from './US.svg-map'
import QuickPick from "../../model/quick_pick";
const STATES = [
    {"name": "Alabama", "abbreviation": "AL", alternateNames: []},
    {"name": "Alaska", "abbreviation": "AK", alternateNames: [] },
    {"name": "Arizona", "abbreviation": "AZ", alternateNames: []},
    {"name": "Arkansas", "abbreviation": "AR", alternateNames: []},
    {"name": "California", "abbreviation": "CA", alternateNames: []},
    {"name": "Colorado", "abbreviation": "CO", alternateNames: []},
    {"name": "Connecticut", "abbreviation": "CT", alternateNames: []},
    {"name": "Delaware", "abbreviation": "DE", alternateNames: []},
    {"name": "District of Columbia", "abbreviation": "DC", alternateNames: []},
    {"name": "Puerto Rico", "abbreviation": "PR", alternateNames: [] },
    {"name": "U.S. Virgin Is.", "abbreviation": "VI", alternateNames: ['United States Virgin Islands'] },
    {"name": "American Samoa", "abbreviation": "AS", alternateNames: [] },
    {"name": "Guam", "abbreviation": "GU", alternateNames: [] },
    {"name": "N. Mariana Is.", "abbreviation": "MP", alternateNames: ['Northern Mariana Islands'] },
    {"name": "Florida", "abbreviation": "FL", alternateNames: []},
    {"name": "Georgia", "abbreviation": "GA", alternateNames: []},
    {"name": "Hawaii", "abbreviation": "HI", alternateNames: [] },
    {"name": "Idaho", "abbreviation": "ID", alternateNames: []},
    {"name": "Illinois", "abbreviation": "IL", alternateNames: []},
    {"name": "Indiana", "abbreviation": "IN", alternateNames: []},
    {"name": "Iowa", "abbreviation": "IA", alternateNames: []},
    {"name": "Kansas", "abbreviation": "KS", alternateNames: []},
    {"name": "Kentucky", "abbreviation": "KY", alternateNames: []},
    {"name": "Louisiana", "abbreviation": "LA", alternateNames: []},
    {"name": "Maine", "abbreviation": "ME", alternateNames: []},
    {"name": "Maryland", "abbreviation": "MD", alternateNames: []},
    {"name": "Massachusetts", "abbreviation": "MA", alternateNames: []},
    {"name": "Michigan", "abbreviation": "MI", alternateNames: []},
    {"name": "Minnesota", "abbreviation": "MN", alternateNames: []},
    {"name": "Mississippi", "abbreviation": "MS", alternateNames: []},
    {"name": "Missouri", "abbreviation": "MO", alternateNames: []},
    {"name": "Montana", "abbreviation": "MT", alternateNames: []},
    {"name": "Nebraska", "abbreviation": "NE", alternateNames: []},
    {"name": "Nevada", "abbreviation": "NV", alternateNames: []},
    {"name": "New Hampshire", "abbreviation": "NH", alternateNames: []},
    {"name": "New Jersey", "abbreviation": "NJ", alternateNames: []},
    {"name": "New Mexico", "abbreviation": "NM", alternateNames: []},
    {"name": "New York", "abbreviation": "NY", alternateNames: []},
    {"name": "North Carolina", "abbreviation": "NC", alternateNames: []},
    {"name": "North Dakota", "abbreviation": "ND", alternateNames: []},
    {"name": "Ohio", "abbreviation": "OH", alternateNames: []},
    {"name": "Oklahoma", "abbreviation": "OK", alternateNames: []},
    {"name": "Oregon", "abbreviation": "OR", alternateNames: []},
    {"name": "Pennsylvania", "abbreviation": "PA", alternateNames: []},
    {"name": "Rhode Island", "abbreviation": "RI", alternateNames: []},
    {"name": "South Carolina", "abbreviation": "SC", alternateNames: []},
    {"name": "South Dakota", "abbreviation": "SD", alternateNames: []},
    {"name": "Tennessee", "abbreviation": "TN", alternateNames: []},
    {"name": "Texas", "abbreviation": "TX", alternateNames: []},
    {"name": "Utah", "abbreviation": "UT", alternateNames: []},
    {"name": "Vermont", "abbreviation": "VT", alternateNames: []},
    {"name": "Virginia", "abbreviation": "VA", alternateNames: []},
    {"name": "Washington", "abbreviation": "WA", alternateNames: []},
    {"name": "West Virginia", "abbreviation": "WV", alternateNames: []},
    {"name": "Wisconsin", "abbreviation": "WI", alternateNames: []},
    {"name": "Wyoming", "abbreviation": "WY", alternateNames: []}
].sort(byName)

function byName(a, b) {
    if (a.name < b.name)
        return -1
    if (a.name > b.name)
        return 1
    return 0
}


export class StateTable {
    abbreviationFromName(name) {
        let state = STATES.find(s => {
            return s.name === name || s.alternateNames.some(s1 => s1 === name);
        })
        if (!state) {
            console.log(`ERROR: Unable to resolve '${name}'`)
            return "Unknown State"
        }
        return state.abbreviation
    }
    fullName(abbreviation) {
        let stateRecord = STATES.filter(s => s.abbreviation === abbreviation)[0];
        if (typeof stateRecord === "undefined") {
            console.log("No state found for: " + JSON.stringify(abbreviation))
            return "N/A"
        }
        return stateRecord.name
    }
    all() {
        return STATES
    }
}

export class StateRegionSpec {
    constructor() {
        let stateTable = new StateTable()
        this.singleNoun = 'state'
        this.pluralNoun = 'states'
        this.matrixMapRatio = [8, 3]
        this.columns = 6
        this.minimumCellWidth = 150;
        this.displayNameFor = function(state) {
            return stateTable.fullName(state)
        }
        this.quickPicks = createUSQuickPicks(stateTable)
        this.mapURI = US_URL
    }
}

function createUSQuickPicks(stateTable) {
    let allStates = stateTable.all();

    return  [
        QuickPick.NONE,
        QuickPick.createStatic('usa', "United States",  allStates.map(s => s.abbreviation)),
    ]
}





