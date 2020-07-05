import React from "react";
import ReactDom from "react-dom";
import App from "./app";

export default class AppBootstrapper {
    constructor(targetElement, settingsManager) {
        this.targetElement = targetElement
        this.settingsManager =settingsManager
    }
    run() {
        ReactDom.render(<App
                settingsManager={this.settingsManager}/>,
            this.targetElement)

    }
}
