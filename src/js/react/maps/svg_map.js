import PropTypes from "prop-types";
import React from "react";
import './svg_map.css'

SvgMap.defaultProps = {
    onHover: (id) => {},
    onClick: (id) => {},
    classNamesProvider: (id) => []
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
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    classNamesProvider : PropTypes.func
}

export default function SvgMap(props) {
    return(
        <svg className='SvgMap' viewBox={props.map.viewBox} xmlns="http://www.w3.org/2000/svg">
                <title>{props.map.label}</title>
                <g onClick={(e) => {
                    let id = e.target.id;
                    if (id && id.length > 0) {
                        props.onClick(id);
                    }
                }}>
                    {props.map.locations.map(location => {
                        let classNames = ['region'].concat(props.classNamesProvider(location.id))
                        return <path key={location.id}
                              className={classNames.join(' ')}
                              id={location.id}
                              d={location.path}
                              onMouseEnter={() => props.onHover(location.id)}
                              onMouseLeave={() => props.onHover(null)}>
                            <title>{location.name}</title>
                        </path>
                        })
                    }
                </g>
            </svg>)
}

