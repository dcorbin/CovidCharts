import React, {useState} from 'react'
import PropTypes from 'prop-types'
import QuickPickButton from "./quick_pick_button";


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

    function renderCreateNewQuickPickButton() {
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

    let createButtonClassNames = ['Button']
    if (!createEnabled) {
        createButtonClassNames.push('disabled')
    }

    return <table className='QuickPickBar'>
            <tbody>
            <tr>
                <td className='Buttons'>
                    <b>Quick&nbsp;Picks:&nbsp;</b>{renderCreateNewQuickPickButton()}
                </td>
                <td>
                    <div className='QuickPicker'>
                        {
                            props.quickPicks.map(p => {
                                return <QuickPickButton key={p.key} quickPick={p} onClick={clicked}
                                                        onDelete={props.onDeleteQuickPick}/>
                            })
                        }
                    </div>
                </td>
            </tr>


        {
            showNewQuickPickForm ? <tr><td className='QuickPickForm'>
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

            </td> </tr>: null}
            </tbody>
    </table>

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
    onDeleteQuickPick: PropTypes.func,

}