import React from 'react'
import {StateTable} from "../states";

function continentalUs(table) {
    return table.all().filter(s => s.continental)
}
function exactly(statesToInclude) {
    return function (table) {
        return table.all().filter(s =>
            statesToInclude.includes(s.abbreviation));
    }
}
const QUICK_PICKS = [
    {
        key: 'none',
        text: "None",
        filter: (table) => []
    },
    {
        key: 'southeast',
        text: "Southeast",
        filter: (table) => exactly(['FL', 'GA', 'SC', 'NC', 'AL', 'TN', 'KY', 'AR', 'MS', 'LA'])(table)
    },
    {
        key: 'tri-state',
        text: "Tri-state",
        filter: (table) => exactly(['NY', 'NJ', 'CT'])(table)
    },
    {
        key: 'usa',
        text: "United States",
        filter: (table) => table.all()},
    {
        key: 'continentalUs',
        text: "Continental US",
        filter: (table) => continentalUs(table)
    },
    {
        key: 'continental-ny',
        text: "Continental US w/o NY",
        filter: (table) => continentalUs(table).filter(s => s.abbreviation !== 'NY')
    },
]

export default function StateQuickPick(props) {
    function clicked(pick) {
        props.onClick(pick.filter(new StateTable()).map(s => s.abbreviation))
    }
    return <div className='StateQuickPicker'> <h3>Quick Picks</h3> {

        QUICK_PICKS.map(p => {
            return <div key={p.key}  className='quickpick' onClick={() => clicked(p)}>
                {p.text}
            </div>
        })
    }
    </div>

}