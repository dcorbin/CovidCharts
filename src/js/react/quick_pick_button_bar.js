import React, {useState} from 'react'
import PropTypes from 'prop-types'


export default function QuickPickButtonBar(props) {
    let [showNewQuickPickForm, setShowNewQuickPickForm] = useState(false)
    let [createEnabled, setCreateEnabled] = useState(false)

    function clicked(pick) {
        let regions = pick.regions
        if (!regions) {
            regions = props.regions.filter(pick.regionsFilter)
        }
        props.onClick(regions)
    }
    function saveAs() {
        setShowNewQuickPickForm(true)
    }

    function addQuickPick() {
        if (props.onCreateNew) {
            let classNames=['quickPickAction', 'Button']
            if (showNewQuickPickForm)
                classNames.push('disabled')
            return <span className={classNames.join(' ')} onClick={saveAs}>+</span>
        }
        return null
    }

    function saveClicked() {
        let textBox = document.getElementById('quickPickName')
        setShowNewQuickPickForm(false)
        this.props.onCreateNew(textBox.value)
    }

    function renderQuickPick(quickPick) {
        return <span key={quickPick.key} className='quickPick' onClick={() => clicked(quickPick)}>
                        {quickPick.text.replace(/ /g, '\u00a0')}
                    </span>
    }
    let createButtonClassNames = ['Button']
    if (!createEnabled) {
        createButtonClassNames.push('disabled')
    }

    return <div className='QuickPickBar'>
            <div className='Buttons'>
                <b>Quick Picks: </b>
                <span className='QuickPicker'>
                    {addQuickPick()}
                    {
                        props.quickPicks.map(p => {
                            return renderQuickPick(p)
                        })
                    }

                </span>
            </div>
        {
            showNewQuickPickForm ? <div className='QuickPickForm'>
            <form id='quickPickSave'>
                <label htmlFor='quickPickName'>Quick Pick Name:</label>
                <input type='text' id="quickPickName" defaultValue="" autoFocus={true}
                       onChange={(e) => {
                           setCreateEnabled(e.currentTarget.value.length > 0)
                       }}/>
                <span className={createButtonClassNames.join(' ')}  onClick={saveClicked}>Create</span>
                <span className='Button'  onClick={()=>setShowNewQuickPickForm(false)}>Cancel</span>
            </form>

        </div> : null}
    </div>

}

QuickPickButtonBar.propTypes = {
    regions: PropTypes.arrayOf(PropTypes.string).isRequired,
    quickPicks: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        regions: PropTypes.arrayOf(PropTypes.string),
        regionsFilter: PropTypes.func
    })),
    onClick: PropTypes.func.isRequired,
    onCreateNew: PropTypes.func,

}