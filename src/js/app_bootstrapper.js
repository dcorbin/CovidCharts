import React from "react";
import ReactDom from "react-dom";
import App from "./app";

export default class AppBootstrapper {
    constructor(targetElement, settingsManager, urlManager) {
        this.targetElement = targetElement
        this.settingsManager = settingsManager
        this.urlManager = urlManager
    }
    run() {
        ReactDom.render(<App
                settingsManager={this.settingsManager}
                urlManager={this.urlManager}
            />,
            this.targetElement)

    }
}
