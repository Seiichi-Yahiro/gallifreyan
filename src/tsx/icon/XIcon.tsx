import * as React from 'react';
import { IIconProps } from './BaseIcon';
import { createClassName } from '../component/ComponentUtils';

const XIcon: React.FunctionComponent<IIconProps> = ({ className }) => (
    <svg className={createClassName('svg', className)}>
        <g style={{ transform: 'translate(50%, 50%) rotate(45deg)' }}>
            <line x1={-10} y1={0} x2={10} y2={0} />
            <line x1={0} y1={10} x2={0} y2={-10} />
        </g>
    </svg>
);

export default XIcon;
