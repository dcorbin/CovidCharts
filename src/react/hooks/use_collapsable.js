import React, {useState} from "react";

export default function useCollapsable(renderExpandedFunction, renderCollapsedFunction, className) {
    const [collapsed, setCollapsed] = useState(false)
    function expansionControl () {
        let image = collapsed ? '/collapsed.png' : '/expanded.png'
        return <img className='expand-collapse-control'
                    onClick={e => setCollapsed(!collapsed)}
                    src={image}
                    alt='Expansion control'/>
    }

    return <div className={className}>
        <div style={{float: 'left'}}>{expansionControl()}</div>
        <div>{collapsed ? renderCollapsedFunction() : renderExpandedFunction()}</div>
    </div>
}

