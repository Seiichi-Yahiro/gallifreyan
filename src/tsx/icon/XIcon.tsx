import * as React from 'react';
import { CSSProperties } from 'react';

const XIcon = () => {
    const lineStyle: CSSProperties = {
        stroke: '#000000',
        strokeWidth: 1
    };

    return (
        <svg height={20} width={20} style={{ cursor: 'pointer' }}>
            <g style={{ transform: 'translate(50%, 50%) rotate(45deg)' }}>
                <line x1={-10} y1={0} x2={10} y2={0} style={lineStyle} />
                <line x1={0} y1={10} x2={0} y2={-10} style={lineStyle} />
            </g>
        </svg>
    );
};

export default XIcon;
