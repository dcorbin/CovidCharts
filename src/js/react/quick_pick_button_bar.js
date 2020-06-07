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

    function processForm() {
        let textBox = document.getElementById('quickPickName')
        if (textBox.value.length === 0) {
            return
        }
        let error = props.onCreateNew(textBox.value)
        if (error) {
            console.log("ERROR: " + error)
            return
        }
        setShowNewQuickPickForm(false)
    }

    function renderQuickPick(quickPick) {
        return <span key={quickPick.key} className='quickPick' onClick={() => clicked(quickPick)}>
                        {quickPick.name.replace(/ /g, '\u00a0')}
                        {quickPick.userManaged ? <img className='menuTrigger' src='/whiteTriangleDown.svg'/> : null}
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
                       onKeyDown={e => {

                           if (e.keyCode === 13) {
                               e.preventDefault()
                               processForm()
                           }
                       }}
                       onChange={(e) => {
                           e.preventDefault()
                           setCreateEnabled(e.currentTarget.value.length > 0)
                       }}/>
                <span className={createButtonClassNames.join(' ')}  onClick={processForm}>Create</span>
                <span className='Button'  onClick={()=>setShowNewQuickPickForm(false)}>Cancel</span>
            </form>

        </div> : null}
    </div>

}

QuickPickButtonBar.propTypes = {
    regions: PropTypes.arrayOf(PropTypes.string).isRequired,
    quickPicks: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        regions: PropTypes.arrayOf(PropTypes.string),
        regionsFilter: PropTypes.func
    })),
    onClick: PropTypes.func.isRequired,
    onCreateNew: PropTypes.func,

}