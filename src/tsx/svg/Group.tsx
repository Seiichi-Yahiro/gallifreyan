import React from 'react';

export const hoverColor = '#2196f3';
export const selectedColor = '#ff1744';

interface GroupProps extends React.SVGProps<SVGGElement> {
    x: number;
    y: number;
    isHovered?: boolean;
    isSelected?: boolean;
}

const Group: React.FunctionComponent<GroupProps> = ({
    x,
    y,
    isHovered = false,
    isSelected = false,
    children,
    ...props
}) => {
    const color = isSelected ? selectedColor : isHovered ? hoverColor : 'inherit';

    return (
        <g {...props} stroke={color} fill={color} style={{ transform: `translate(${x}px, ${y}px)` }}>
            {children}
        </g>
    );
};

export default Group;
