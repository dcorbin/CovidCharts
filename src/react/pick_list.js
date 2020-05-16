import React, {useState} from "react";

export default function PickList(props) {
    const [selection, setSelection] = useState(props.initialSelection)
    function selectionChanged(e) {
        e.preventDefault();
        let newValue = e.currentTarget.options[e.currentTarget.selectedIndex].value;
        setSelection(newValue)
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newValue)
        }
    }

    return <select value={selection} onChange={selectionChanged}> {
        props.all.map(item =>
            <option key={item} value={item}>{props.valueRenderer(item)}</option>
        )
    } </select>
}
