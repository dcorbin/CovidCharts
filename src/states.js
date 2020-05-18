const STATES = [
    {"name": "Alabama", "abbreviation": "AL", actualState: "true" },
    {"name": "Alaska", "abbreviation": "AK", actualState: "true" },
    {"name": "Arizona", "abbreviation": "AZ", actualState: "true" },
    {"name": "Arkansas", "abbreviation": "AR", actualState: "true" },
    {"name": "California", "abbreviation": "CA", actualState: "true" },
    {"name": "Colorado", "abbreviation": "CO", actualState: "true" },
    {"name": "Connecticut", "abbreviation": "CT", actualState: "true" },
    {"name": "Delaware", "abbreviation": "DE", actualState: "true" },
    {"name": "District of Columbia", "abbreviation": "DC", actualState: "false" },
    {"name": "Puerto Rico", "abbreviation": "PR", actualState: "false" },
    {"name": "U.S. Virgin Islands", "abbreviation": "VI", actualState: "false" },
    {"name": "American Samoa", "abbreviation": "AS", actualState: "false" },
    {"name": "Guam", "abbreviation": "GU", actualState: "false" },
    {"name": "N. Mariana Islands", "abbreviation": "MP", actualState: "false" },
    {"name": "Florida", "abbreviation": "FL", actualState: "true" },
    {"name": "Georgia", "abbreviation": "GA", actualState: "true" },
    {"name": "Hawaii", "abbreviation": "HI", actualState: "true" },
    {"name": "Idaho", "abbreviation": "ID", actualState: "true" },
    {"name": "Illinois", "abbreviation": "IL", actualState: "true" },
    {"name": "Indiana", "abbreviation": "IN", actualState: "true" },
    {"name": "Iowa", "abbreviation": "IA", actualState: "true" },
    {"name": "Kansas", "abbreviation": "KS", actualState: "true" },
    {"name": "Kentucky", "abbreviation": "KY", actualState: "true" },
    {"name": "Louisiana", "abbreviation": "LA", actualState: "true" },
    {"name": "Maine", "abbreviation": "ME", actualState: "true" },
    {"name": "Maryland", "abbreviation": "MD", actualState: "true" },
    {"name": "Massachusetts", "abbreviation": "MA", actualState: "true" },
    {"name": "Michigan", "abbreviation": "MI", actualState: "true" },
    {"name": "Minnesota", "abbreviation": "MN", actualState: "true" },
    {"name": "Mississippi", "abbreviation": "MS", actualState: "true" },
    {"name": "Missouri", "abbreviation": "MO", actualState: "true" },
    {"name": "Montana", "abbreviation": "MT", actualState: "true" },
    {"name": "Nebraska", "abbreviation": "NE", actualState: "true" },
    {"name": "Nevada", "abbreviation": "NV", actualState: "true" },
    {"name": "New Hampshire", "abbreviation": "NH", actualState: "true" },
    {"name": "New Jersey", "abbreviation": "NJ", actualState: "true" },
    {"name": "New Mexico", "abbreviation": "NM", actualState: "true" },
    {"name": "New York", "abbreviation": "NY", actualState: "true" },
    {"name": "North Carolina", "abbreviation": "NC", actualState: "true" },
    {"name": "North Dakota", "abbreviation": "ND", actualState: "true" },
    {"name": "Ohio", "abbreviation": "OH", actualState: "true" },
    {"name": "Oklahoma", "abbreviation": "OK", actualState: "true" },
    {"name": "Oregon", "abbreviation": "OR", actualState: "true" },
    {"name": "Pennsylvania", "abbreviation": "PA", actualState: "true" },
    {"name": "Rhode Island", "abbreviation": "RI", actualState: "true" },
    {"name": "South Carolina", "abbreviation": "SC", actualState: "true" },
    {"name": "South Dakota", "abbreviation": "SD", actualState: "true" },
    {"name": "Tennessee", "abbreviation": "TN", actualState: "true" },
    {"name": "Texas", "abbreviation": "TX", actualState: "true" },
    {"name": "Utah", "abbreviation": "UT", actualState: "true" },
    {"name": "Vermont", "abbreviation": "VT", actualState: "true" },
    {"name": "Virginia", "abbreviation": "VA", actualState: "true" },
    {"name": "Washington", "abbreviation": "WA", actualState: "true" },
    {"name": "West Virginia", "abbreviation": "WV", actualState: "true" },
    {"name": "Wisconsin", "abbreviation": "WI", actualState: "true" },
    {"name": "Wyoming", "abbreviation": "WY", actualState: "true" }
].sort(byName)

function byName(a, b) {
    if (a.name < b.name)
        return -1
    if (a.name > b.name)
        return 1
    return 0
}


class StateTable {
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

class State {
    static populate_state_control(selected_state_abbreviation, changeCallback) {
        let table = new StateTable()
        let state_options = table.all().sort(byStateName).map(state => {
            let selected = (state.abbreviation === selected_state_abbreviation) ? ' SELECTED' : ''
            return "<option value='" + state.abbreviation + "' " + selected + ">" + state.name + "</option>"
        })
        let selectElement = document.getElementById('state');
        selectElement.innerHTML = state_options.join("\n")
        selectElement.onchange = changeCallback
    }

    static current_selected_state() {
        let result = null
        document.getElementById('state').childNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE) {
                if (n.nodeName === "OPTION") {
                    if (n.selected) {
                        result = n.value
                    }
                }
            }
        })
        return result
    }
}

export {State, StateTable }



