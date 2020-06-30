import PropTypes from 'prop-types'
import React from "react";
import './error_block.css'

ErrorBlock.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    componentStack: PropTypes.string.isRequired,
    resetErrorBoundary: PropTypes.func.isRequired
}

function ErrorBlock(props) {
    return (
        <div className="ErrorBlock alert">
            <div>
                <h3>Something went wrong:</h3>
                <pre className='error'>{props.errorMessage}</pre>
                <pre className='stack'>{props.componentStack}</pre>
                <p>Please file a bug at
                    <a href='https://github.com/dcorbin/CovidCharts/issues'>https://github.com/dcorbin/CovidCharts/issues</a>.
                    Copy the above information into the report</p>
                <button onClick={props.resetErrorBoundary}>Try again</button>
            </div>
        </div>
    )
}

ErrorBlock.callback = function ({error, componentStack, resetErrorBoundary}) {
    return <ErrorBlock errorMessage={error.message}
                       componentStack={componentStack}
                       resetErrorBoundary={resetErrorBoundary}/>
}
export default ErrorBlock

