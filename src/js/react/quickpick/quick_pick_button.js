import React from "react";
import PropTypes from "prop-types";
import PROP_TYPES  from "../model/prop_types";

export default function QuickPickButton(props) {
    let quickPick = props.quickPick

    function renderDeleteAction() {
        return <span>
                                    <span className='actionSeparator'>|</span>
                                    <img className='deleteAction'
                                         alt='Delete'
                                         src='/whiteX.svg'
                                         onClick={(e) => {
                                             e.preventDefault()
                                             props.onDelete(quickPick)
                                         }}/>
                        </span>;
    }

    function renderDeleteActionIfNeeded() {
        return quickPick.userManaged && props.onDelete
            ? renderDeleteAction()
            : null;
    }

    return <span className='QuickPickButton' >
                <span className='quickPick' onClick={()=>props.onClick(quickPick)}>
                    {quickPick.name.replace(/ /g, '\u00a0')}
                </span>
                {renderDeleteActionIfNeeded()}
                <span> </span>
    </span>
}

QuickPickButton.propTypes = {
    quickPick: PROP_TYPES.QuickPick.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func
}
