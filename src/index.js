import State from './states'
import {CovidTracking, CovidTrackingCache} from './covid_tracking'
import {chart_state_data} from "./charting";
import {Settings, SettingsStore} from './settings';


function create_stateChange_handler(cache, settings_store) {
    return function() {
        let new_state = State.current_selected_state();
        chart_state_data(cache.fetch(), new_state);
        let settings = settings_store.load();
        settings.state = new_state
        settings_store.store(settings)
    }
}

function initialize() {
    let settings_store = new SettingsStore(window.localStorage)
    function loadOrCreateSettings() {
        let settings = settings_store.load()
        if (settings == null) {
            settings = new Settings()
            settings_store.store(settings)
        }
        return settings
    }
    let settings = loadOrCreateSettings();
    let cache = new CovidTrackingCache()
    let initial_state = settings.state
    State.populate_state_control(initial_state, create_stateChange_handler(cache, settings_store))
    CovidTracking.fetch_covid_tracking_data_p(cache).then(unk => {
        chart_state_data(cache.fetch(), initial_state)
    })
}

window.onload = initialize
