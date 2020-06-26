import CloseIcon from "../close/close_icon";
import React, {useCallback, useEffect} from "react";
import PropTypes from "prop-types";

PopupView.propTypes = {
    closePopup: PropTypes.func.isRequired,
    content: PropTypes.func.isRequired
}
export default function PopupView(props) {
    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        document.addEventListener("click", props.closePopup, false);


        return () => {
            document.removeEventListener("keydown", escFunction, false);
            document.removeEventListener("click", props.closePopup, false);
        };
    }, []);

    const escFunction = useCallback((event) => {
        if(event.key === "Escape") {
            props.closePopup()
        }
    }, []);

    return (
        <div className='PopupView' onKeyDown={(e) => {
            if (e.key === "Escape") {
                e.preventDefault()
                props.closePopup()
            }
        }}>
            <CloseIcon onClick={props.closePopup}/>
            {props.content()}
        </div>
    );
}
