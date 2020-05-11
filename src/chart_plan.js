class ChartPlan {
    constructor(name, prepare_controls, show_chart) {
        this.name = name
        this.prepare_controls = null
        this.show_chart = null
    }
}

const PLANS = {
    'by-state': new ChartPlan("by State")
}
