import React from 'react';

interface GroupProps {
    x: number;
    y: number;
}

const Group: React.FunctionComponent<GroupProps> = ({ x, y, children }) => (
    <g style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</g>
);

export default Group;
