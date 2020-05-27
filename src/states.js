import US from "Maps/US";

const STATES = [
    {"name": "Alabama", "abbreviation": "AL", actualState: true, continental: true },
    {"name": "Alaska", "abbreviation": "AK", actualState: true, continental: false },
    {"name": "Arizona", "abbreviation": "AZ", actualState: true, continental: true },
    {"name": "Arkansas", "abbreviation": "AR", actualState: true, continental: true },
    {"name": "California", "abbreviation": "CA", actualState: true, continental: true },
    {"name": "Colorado", "abbreviation": "CO", actualState: true, continental: true },
    {"name": "Connecticut", "abbreviation": "CT", actualState: true, continental: true },
    {"name": "Delaware", "abbreviation": "DE", actualState: true, continental: true },
    {"name": "District of Columbia", "abbreviation": "DC", actualState: false, continental: true },
    {"name": "Puerto Rico", "abbreviation": "PR", actualState: false, continental: false },
    {"name": "U.S. Virgin Is.", "abbreviation": "VI", actualState: false, continental: false },
    {"name": "American Samoa", "abbreviation": "AS", actualState: false, continental: false },
    {"name": "Guam", "abbreviation": "GU", actualState: false, continental: false },
    {"name": "N. Mariana Is.", "abbreviation": "MP", actualState: false, continental: false },
    {"name": "Florida", "abbreviation": "FL", actualState: true, continental: true },
    {"name": "Georgia", "abbreviation": "GA", actualState: true, continental: true },
    {"name": "Hawaii", "abbreviation": "HI", actualState: true, continental: false },
    {"name": "Idaho", "abbreviation": "ID", actualState: true, continental: true },
    {"name": "Illinois", "abbreviation": "IL", actualState: true, continental: true },
    {"name": "Indiana", "abbreviation": "IN", actualState: true, continental: true },
    {"name": "Iowa", "abbreviation": "IA", actualState: true, continental: true },
    {"name": "Kansas", "abbreviation": "KS", actualState: true, continental: true },
    {"name": "Kentucky", "abbreviation": "KY", actualState: true, continental: true },
    {"name": "Louisiana", "abbreviation": "LA", actualState: true, continental: true },
    {"name": "Maine", "abbreviation": "ME", actualState: true, continental: true },
    {"name": "Maryland", "abbreviation": "MD", actualState: true, continental: true },
    {"name": "Massachusetts", "abbreviation": "MA", actualState: true, continental: true },
    {"name": "Michigan", "abbreviation": "MI", actualState: true, continental: true },
    {"name": "Minnesota", "abbreviation": "MN", actualState: true, continental: true },
    {"name": "Mississippi", "abbreviation": "MS", actualState: true, continental: true },
    {"name": "Missouri", "abbreviation": "MO", actualState: true, continental: true },
    {"name": "Montana", "abbreviation": "MT", actualState: true, continental: true },
    {"name": "Nebraska", "abbreviation": "NE", actualState: true, continental: true },
    {"name": "Nevada", "abbreviation": "NV", actualState: true, continental: true },
    {"name": "New Hampshire", "abbreviation": "NH", actualState: true, continental: true },
    {"name": "New Jersey", "abbreviation": "NJ", actualState: true, continental: true },
    {"name": "New Mexico", "abbreviation": "NM", actualState: true, continental: true },
    {"name": "New York", "abbreviation": "NY", actualState: true, continental: true },
    {"name": "North Carolina", "abbreviation": "NC", actualState: true, continental: true },
    {"name": "North Dakota", "abbreviation": "ND", actualState: true, continental: true },
    {"name": "Ohio", "abbreviation": "OH", actualState: true, continental: true },
    {"name": "Oklahoma", "abbreviation": "OK", actualState: true, continental: true },
    {"name": "Oregon", "abbreviation": "OR", actualState: true, continental: true },
    {"name": "Pennsylvania", "abbreviation": "PA", actualState: true, continental: true },
    {"name": "Rhode Island", "abbreviation": "RI", actualState: true, continental: true },
    {"name": "South Carolina", "abbreviation": "SC", actualState: true, continental: true },
    {"name": "South Dakota", "abbreviation": "SD", actualState: true, continental: true },
    {"name": "Tennessee", "abbreviation": "TN", actualState: true, continental: true },
    {"name": "Texas", "abbreviation": "TX", actualState: true, continental: true },
    {"name": "Utah", "abbreviation": "UT", actualState: true, continental: true },
    {"name": "Vermont", "abbreviation": "VT", actualState: true, continental: true },
    {"name": "Virginia", "abbreviation": "VA", actualState: true, continental: true },
    {"name": "Washington", "abbreviation": "WA", actualState: true, continental: true },
    {"name": "West Virginia", "abbreviation": "WV", actualState: true, continental: true },
    {"name": "Wisconsin", "abbreviation": "WI", actualState: true, continental: true },
    {"name": "Wyoming", "abbreviation": "WY", actualState: true, continental: true }
].sort(byName)

function byName(a, b) {
    if (a.name < b.name)
        return -1
    if (a.name > b.name)
        return 1
    return 0
}


export class StateTable {
    fullName(abbreviation) {
        let stateRecord = STATES.filter(s => s.abbreviation === abbreviation)[0];
        if (typeof stateRecord === "undefined") {
            console.log("No state found for: " + JSON.stringify(abbreviation))
            return "N/A"
        }
        return stateRecord.name
    }
    all_abbreviations() {
        return STATES.map(s => s.abbreviation)
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
        this.displayNameFor = function(state) {
            return stateTable.fullName(state)
        }
        this.quickPicks = createQuickPicks(stateTable)
        this.map = US
    }
}

function createQuickPicks(stateTable) {
    let allStates = stateTable.all();
    let continentalStates = allStates.filter(s => s.continental)
    return  [
        {
            key: 'none',
            text: "None",
            regions: []
        },
        {
            key: 'southeast',
            text: "Southeast",
            regions:['FL', 'GA', 'SC', 'NC', 'AL', 'TN', 'KY', 'AR', 'MS', 'LA']
        },
        {
            key: 'tri-state',
            text: "Tri-state",
            regions:['NY', 'NJ', 'CT']
        },
        {
            key: 'usa',
            text: "United States",
            regions: allStates.map(s => s.abbreviation)},
        {
            key: 'continentalUs',
            text: "Continental US",
            regions: continentalStates.map(s => s.abbreviation)
        },
        {
            key: 'continental-ny',
            text: "Continental US w/o NY",
            regions: null,
            regionsFilter: s => s !== 'NY'
        },
    ]
}





