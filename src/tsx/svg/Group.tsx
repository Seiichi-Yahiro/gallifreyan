import React from 'react';
import { calculateTranslation } from '../utils/TextTransforms';

export const hoverColor = '#2196f3';
export const selectedColor = '#ff1744';

export enum AnglePlacement {
    Absolute = 'Absolute',
    Relative = 'Relative',
}

interface GroupProps extends React.SVGProps<SVGGElement> {
    angle: number;
    parentDistance: number;
    anglePlacement: AnglePlacement;
    reverse?: boolean;
    isHovered?: boolean;
    isSelected?: boolean;
}

const Group: React.FunctionComponent<GroupProps> = ({
    angle,
    parentDistance,
    anglePlacement,
    reverse = false,
    isHovered = false,
    isSelected = false,
    children,
    ...props
}) => {
    const color = isSelected ? selectedColor : isHovered ? hoverColor : 'inherit';

    const createTransform = () => {
        switch (anglePlacement) {
            case AnglePlacement.Absolute:
                const { x, y } = calculateTranslation(angle, parentDistance);
                return reverse ? `translate(${-x}px, ${-y}px)` : `translate(${x}px, ${y}px)`;
            case AnglePlacement.Relative:
                return reverse
                    ? `translateY(${-parentDistance}px) rotate(${angle}deg)`
                    : `rotate(${-angle}deg) translateY(${parentDistance}px)`;
        }
    };

    return (
        <g
            {...props}
            stroke={color}
            fill={color}
            style={{
                transform: createTransform(),
            }}
        >
            {children}
        </g>
    );
};

export default Group;
