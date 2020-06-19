import PropTypes from "prop-types";
import SvgMap from "./svg_map";
import React, {useState} from "react";

const {useEffect} = require("react");

DownloadedMap.propTypes = {
    mapURI: PropTypes.string.isRequired,
    onRegionSelected: PropTypes.func,
    onHover: PropTypes.func,
    classNamesProvider: PropTypes.func
}

export default function DownloadedMap(props) {
    const [regionMap, setRegionMap] = useState(null)
    useEffect(initiateMapFetch, [props.mapURI])

    function initiateMapFetch() {
        let uri = props.mapURI
        let isLoading = true
        fetch(uri, {method: 'GET', })
            .then(
                response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                    response.text().then(t => console.log(`JSON: ${t}`))
                    return null
                }
            )
            .then(json => {
                if (isLoading)
                  setRegionMap(json);
            })
        return () => {isLoading = false}

    }

    if (!regionMap) {
        return null
    }
    return (
        <div style={{
            width: '100%',
            height: '100%'
        }}>
        <SvgMap
            map={regionMap}
            onClick={props.onRegionSelected}
            onHover={props.onHover}
            classNamesProvider={props.classNamesProvider}/>
            </div>
    )


}