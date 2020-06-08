import React, {useState} from "react";
import PropTypes from "prop-types";

export default function QuickPickButton(props) {
    let quickPick = props.quickPick
    return <span className='QuickPickButton' >
                <span className='quickPick' onClick={()=>props.onClick(quickPick)}>
                    {quickPick.name.replace(/ /g, '\u00a0')}
                    {quickPick.userManaged && props.onDelete
                        ? <span>
                                    <span className='actionSeparator'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                    <span className='deleteAction'
                                          onClick={(e) => {
                                              e.preventDefault()
                                              props.onDelete(quickPick)
                                          }}>X</span>
                        </span>
                        : null}
                </span> </span>

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
