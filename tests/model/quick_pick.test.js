import QuickPick from "../../src/js/model/quick_pick";
import {expect} from "@jest/globals";

test('JSON for quickPick', () => {
    let pick = QuickPick.createUserManaged("A", "B", ["1", "2"])
    let json = JSON.stringify(pick);
    expect("").toEqual(json)
})
