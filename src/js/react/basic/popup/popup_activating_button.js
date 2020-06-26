import React, {useCallback, useState} from "react";
import './popup_activating_button.css'
import PropTypes from "prop-types";

import PopupView from "./popup_view";

PopupActivatingButton.propTypes = {
    linkContent: PropTypes.func.isRequired,
    popupContent: PropTypes.func.isRequired
}
export function PopupActivatingButton(props) {
    let [popupShowing, setPopupShowing] = useState(false)
    function togglePopup() {
        setPopupShowing(!popupShowing)
    }
    return (
        <span className='PopupActivatingButton'>
            <span className='graphicLink' onClick={(e) => {
                e.preventDefault()
                togglePopup()
            }
            }>{props.linkContent()}</span>

            {popupShowing ?
                <PopupView
                    content={props.popupContent}
                    closePopup={togglePopup}
                />
                : null
            }
        </span>

    )
}