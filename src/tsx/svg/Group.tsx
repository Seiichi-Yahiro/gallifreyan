import React from 'react';

interface GroupProps extends React.SVGProps<SVGGElement> {
    x: number;
    y: number;
    isHovered?: boolean;
}

const Group: React.FunctionComponent<GroupProps> = ({ x, y, isHovered = false, children, ...props }) => (
    <g
        {...props}
        stroke={isHovered ? '#ff0000' : 'inherit'}
        fill={isHovered ? '#ff0000' : 'inherit'}
        style={{ transform: `translate(${x}px, ${y}px)` }}
    >
        {children}
    </g>
);

export default Group;
