import React from "react";
import ReactDom from "react-dom";
import App from "./app";

export default class AppBootstrapper {
    constructor(targetElement, settingsManager, urlManager, locationManager) {
        this.targetElement = targetElement
        this.settingsManager = settingsManager
        this.urlManager = urlManager
        this.locationManager = locationManager
    }
    run() {
        ReactDom.render(<App
                settingsManager={this.settingsManager}
                urlManager={this.urlManager}
                locationManager={this.locationManager}
            />,
            this.targetElement)

    }
}
