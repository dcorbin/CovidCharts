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
        let body = document.getElementsByTagName('body')[0]
        let classNames = body.className.split(' ')

        let newClassNames = [...classNames, 'blurred']
        body.className = newClassNames.join(' ')

        return () => {
            document.removeEventListener("keydown", escFunction, false);
            document.removeEventListener("click", props.closePopup, false);
            body.className = classNames.join(' ')
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
            <div className='background'/>
            <div className='foreground' >

                <CloseIcon onClick={props.closePopup}/>
                <div className='content' >
                    {props.content()}
                </div>
            </div>
        </div>
    );
}
