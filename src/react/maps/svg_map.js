import PropTypes from "prop-types";
import React from "react";

export default function SvgMap(props) {
    return <svg className='map' viewBox={props.map.viewBox} xmlns="http://www.w3.org/2000/svg">
                <title>{props.map.label}</title>
                <g>
                    {props.map.locations.map(location => {
                        let items = props.classNamesProvider(location.id);
                        let classNames = ['region'].concat(items)
                        return (
                                <path key={location.id}
                                      className={classNames.join(' ')}
                                      id={location.id}
                                      d={location.path}
                                      onFocus={props.onFocus(location.id)}
                                      onBlur={props.onBlur(location.id)}>
                                    <title>{location.name}</title>
                                </path>
                            )
                        })
                    }
                </g>
            </svg>
}
SvgMap.defaultProps = {
    onFocus: (id) => {},
    onBlur: (id) => {},
    classNamesProvidier: (id) => []
}
SvgMap.propTypes =  {
    map: PropTypes.shape({
        viewBox: PropTypes.string.isRequired,
        locations: PropTypes.arrayOf(
            PropTypes.shape({
                path: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
                name: PropTypes.string
            })
        ).isRequired,
        label: PropTypes.string
    }).isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    classNamesProvider : PropTypes.func
}

