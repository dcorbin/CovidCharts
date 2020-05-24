import React from 'react'


export default function RegionQuickPick(props) {
    function clicked(pick) {
        props.onClick(pick.regions)
    }
    return <div className='QuickPicker'> <h3>Quick Picks</h3> {

       props.quickPicks.map(p => {
            return <div key={p.key}  className='quickpick' onClick={() => clicked(p)}>
                • {p.text}
            </div>
        })
    }
    </div>

}