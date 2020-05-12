import ChartPlan from "./chart_plan";
import StatePickList from "./react/state_pick_list";
import React from "react";
import {chart_state_data} from "./charting";

class ByStateLineChart extends ChartPlan {
    constructor() {
        super("By State")
    }

    control_panel_contents(settings_store, onChange) {
        function stateSelectionChanged(newValue) {
            onChange()
            // ReactDOM.render(chart_state_data(cache.fetch(), newValue),
            //     document.getElementById("chart"))
            let settings = settings_store.load();
            settings.state = newValue
            settings_store.store(settings)
        }

        return <StatePickList initialState={settings_store.load().state} onSelectionChange={stateSelectionChanged}/>
    }
}