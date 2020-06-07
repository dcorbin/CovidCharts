import {expect} from "@jest/globals";
import onlyUnique, {unique} from "../../src/js/util/unique";
import {datesAreEqual} from "../../src/js/util/date_comparison";
import QuickPick from "../../src/js/model/quick_pick";

test('JSON for quickPick', () => {
    let pick = QuickPick.createUserManaged("A", "B", ["1", "2"])
    let json = JSON.stringify(pick);
    console.log(json)
    // expect("").toEqual(json)
})
