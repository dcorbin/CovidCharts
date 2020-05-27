import PropTypes from "prop-types";
import React from "react";

export default function SvgMap(props) {
    return <svg className='map' viewBox={props.map.viewBox} xmlns="http://www.w3.org/2000/svg">
                <title>{props.map.label}</title>
                <g>
                    {props.map.locations.map(l => {
                        let classNames = ['region']
                        if (props.selected.includes(l.id))
                            classNames.push('selected')
                        return (
                                <path key={l.id}
                                      className={classNames.join(' ')}
                                      id={l.id}
                                      d={l.path}
                                      onFocus={props.onFocus ? () => props.onFocus(l.id) : null}
                                      onBlur={props.onBlur ? () => props.onBlur(l.id) : null}>
                                    <title>{l.name}</title>
                                </path>
                            )
                        })
                    }
                </g>
            </svg>
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
    selected: PropTypes.arrayOf(
        PropTypes.string,
    ).isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
}

