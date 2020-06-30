import {expect, jest} from "@jest/globals";

test('Run the App', () => {
    document.body.innerHTML =
        '<div id="app"/>'

    require("../src/js/index.js")
    window.onload()
    let appDiv = document.getElementById("app")
    // expect(appDiv.innerHTML).toEqual("")
})
