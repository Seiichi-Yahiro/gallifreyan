import * as React from 'react';

interface IGroupProps extends React.SVGProps<SVGGElement> {
    x: number;
    y: number;
    unit?: Unit;
}

export enum Unit {
    PIXEL = 'px',
    PERCENT = '%'
}

const Group: React.FunctionComponent<IGroupProps> = ({
    x,
    y,
    unit = Unit.PIXEL,
    children,
    ...props
}) => (
    <g {...props} style={{ transform: `translate(${x}${unit}, ${y}${unit})` }}>
        {children}
    </g>
);

export default Group;
