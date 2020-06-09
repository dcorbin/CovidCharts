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

    function renderForm() {
        return <div className='Form'>
            <form id='quickPickSave'>
                <label htmlFor='quickPickName'>Quick Pick Name: </label>
                <input type='text' id="quickPickName" defaultValue="" autoFocus={true}
                       onKeyDown={e => {

                           if (e.key === "Enter") {
                               e.preventDefault()
                               processForm()
                           } else if (e.key === "Escape") {
                               e.preventDefault()
                               setShowNewQuickPickForm(false)
                           }
                       }}
                       onChange={(e) => {
                           e.preventDefault()
                           setCreateEnabled(e.currentTarget.value.length > 0)
                       }}/>
                <span className={createButtonClassNames.join(' ')} onClick={processForm}>Create</span>
                <span className='Button' onClick={() => setShowNewQuickPickForm(false)}>Cancel</span>
            </form>

        </div>;
    }

    function renderFormIfOpen() {
        return showNewQuickPickForm ? renderForm() : null;
    }

    return (
        <div className='QuickPickBar'>
            <div className='Table'>
                <div className='Row'>
                    <div className='Buttons'>
                        <b>Quick&nbsp;Picks:&nbsp;</b>{renderCreateNewQuickPickButton()}
                    </div>
                    <div className='QuickPicker'>
                        {
                            props.quickPicks.map(p => {
                                return <QuickPickButton key={p.key} quickPick={p} onClick={clicked}
                                                        onDelete={props.onDeleteQuickPick}/>
                            })
                        }
                    </div>
                </div>
            </div>
            {renderFormIfOpen()}
        </div>
    )

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