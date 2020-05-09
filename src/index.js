import State from  './states'
import {CovidTracking, CovidTrackingCache} from './covid_tracking'
import {chart_state_data} from "./charting";


function create_stateChange_handler(cache) {
    return function() {
        let new_state = State.current_selected_state();
        chart_state_data(cache.fetch(), new_state);
    }
}

function initialize() {
    let cache = new CovidTrackingCache()
    let initial_state = 'GA';
    let on_change_handler = create_stateChange_handler(cache);
    State.populate_state_control(initial_state, on_change_handler)
    let pending_fetch = CovidTracking.fetch_covid_tracking_data_p(cache)
    pending_fetch.then( unk => {
        chart_state_data(cache.fetch(), initial_state)
    })
}

window.onload = initialize
