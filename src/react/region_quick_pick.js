import React from 'react'


export default function RegionQuickPick(props) {
    function clicked(pick) {
        let regions = pick.regions
        if (!regions) {
            regions = props.regions.filter(pick.regionsFilter)
        }
        props.onClick(regions)
    }

    return <div className='QuickPickBar'>
            <b>Quick Picks: </b>
            <span className='QuickPicker'>
                {

                    props.quickPicks.map(p => {
                        return <span key={p.key} className='quickpick' onClick={() => clicked(p)}>
                        {p.text}
                    </span>
                    })
                }
            </span>
    </div>

}