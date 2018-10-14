import * as React from 'react';

interface IGroupProps {
    x: number;
    y: number;
    unit?: Unit;
}

export enum Unit {
    PIXEL = 'px',
    PERCENT = '%'
}

const Group: React.SFC<IGroupProps> = ({x, y, unit = Unit.PIXEL, children}) => (
    <g style={{transform: `translate(${x}${unit}, ${y}${unit})`}}>
        {children}
    </g>
);

export default Group;