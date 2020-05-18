import React, {useState} from "react";
import ColumnarMatrix from "./columnar_matrix";
import useCollapsable from "./hooks/use_collapsable";
import SelectableValue from "./selectable_value";


export default function MultiPickMatrix(props) {
    const [selections, setSelections] = useState(new Set(props.initialSelections))

    function valueClicked(value) {
        let selectionClicked = value
        let adjustedSelections = new Set([...selections])
        if (selections.has(selectionClicked)) {
            adjustedSelections.delete(selectionClicked)
        } else {
            adjustedSelections.add(selectionClicked)
        }
        setSelections(new Set(adjustedSelections))
        if (props.onSelectionChange) {
            props.onSelectionChange(Array.from(adjustedSelections))
        }
    }


    function cellSelectionTable () {
        return <ColumnarMatrix values={props.allValues}
                               columns={props.columns}
                               onValueClicked={valueClicked}
                               valueRenderer={v => {
                                   return <SelectableValue value={v}
                                                           valueRenderer={props.valueRenderer}
                                                           selected={selections.has(v)}/>;
                               }}
        />
    }
    function currentSelectionSummary() {
        return <span>&nbsp; { props.summaryRenderer([...selections])}</span>
    }

    return useCollapsable(cellSelectionTable, currentSelectionSummary, 'MultiPickMatrix')
}
