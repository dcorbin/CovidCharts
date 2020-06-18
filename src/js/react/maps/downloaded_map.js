import PropTypes from "prop-types";
import SvgMap from "./svg_map";
import React, {useState} from "react";

DownloadedMap.propTypes = {
    mapURI: PropTypes.string.isRequired,
    onRegionSelected: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired,
    classNamesProvider: PropTypes.func.isRequired
}

export default function DownloadedMap(props) {
    const [regionMap, setRegionMap] = useState(null)
    if (!regionMap)
        initiateMapFetch(props.mapURI)

    function initiateMapFetch(uri) {
        fetch(uri, {method: 'GET', })
            .then(
                response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                    console.log(`STATUS: ${response.status}`)
                    response.text().then(t => console.log(`JSON: ${t}`))
                    return null
                }
            )
            .then(json => setRegionMap(json))
        return null
    }

    if (!regionMap) {
        return null
    }
    return (
        <SvgMap
            map={regionMap}
            onClick={props.onRegionSelected}
            onHover={props.onHover}
            classNamesProvider={props.classNamesProvider}/>
    )


}