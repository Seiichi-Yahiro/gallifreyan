import React from 'react';
import useHover from '../hooks/useHover';
import { LineSlot } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';

interface SVGLineSlotProps extends LineSlot {}

const SVGLineSlot: React.FunctionComponent<SVGLineSlotProps> = ({ angle, parentDistance }) => {
    const { x, y } = calculateTranslation(angle, parentDistance);
    const length = Math.sqrt(x * x + y * y);
    const lineLength = 10;
    const xDir = (lineLength * x) / length;
    const yDir = (lineLength * y) / length;
    const x2 = x + xDir;
    const y2 = y + yDir;

    const { isHovered: isHoveredSlot, toggleHover: toggleSlotHover } = useHover();
    const { isHovered: isHoveredConnection, toggleHover: toggleConnectionHover } = useHover();

    return (
        <Group x={0} y={0} isHovered={isHoveredSlot || isHoveredConnection}>
            <line x1={x} y1={y} x2={x2} y2={y2} strokeWidth={1} stroke="inherit" />
            <circle
                cx={x}
                cy={y}
                r={5}
                fill="transparent"
                stroke={isHoveredSlot ? 'inherit' : 'none'}
                onMouseEnter={toggleSlotHover(true)}
                onMouseLeave={toggleSlotHover(false)}
            />
            <circle
                cx={x2}
                cy={y2}
                r={5}
                fill="transparent"
                stroke={isHoveredConnection ? 'inherit' : 'none'}
                onMouseEnter={toggleConnectionHover(true)}
                onMouseLeave={toggleConnectionHover(false)}
            />
        </Group>
    );
};

export default SVGLineSlot;
