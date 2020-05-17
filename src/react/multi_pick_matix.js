import React, {useState} from "react";
import ColumnarMatrix from "./columnar_matrix";
import useCollapsable from "./hooks/use_collapsable";


export default function MultiPickMatrix(props) {
    const [selections, setSelections] = useState(new Set(props.initialSelections))

    function valueClicked(value) {
        console.log("Value Clicked: " + value)
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
                                   let classNames = ['indicator', 'selectable'];
                                   let selected = ''
                                   if (selections.has(v)) {
                                       classNames.push('selected')
                                       selected = 'selected'
                                   }
                                   return <span className={classNames.join(' ')}>
                                        <img className='indicator' alt="Selected"
                                             style={{width: 8, height: 8, verticalAlign: 'middle'}}
                                             src='/circle-16.png'/>
                                        &nbsp;<span className={selected}>
                                       {props.valueRenderer(v)}</span></span>
                                  }
                               }
        />
    }
    function currentSelectionSummary() {
        return <span>&nbsp; { props.summaryRenderer([...selections])}</span>
    }

    return useCollapsable(cellSelectionTable, currentSelectionSummary, 'MultiPickMatrix')
}
