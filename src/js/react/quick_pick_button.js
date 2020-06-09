import React, {useState} from "react";
import PropTypes from "prop-types";

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
    quickPick: PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        regions: PropTypes.arrayOf(PropTypes.string),
        regionsFilter: PropTypes.func
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func
}
