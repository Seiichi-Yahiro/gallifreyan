import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { UUID } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import Maybe from '../utils/Maybe';
import { useDispatch } from 'react-redux';
import useHover from '../hooks/useHover';

interface SVGLineSlotProps {
    id: UUID;
}

const SVGLineSlot: React.FunctionComponent<SVGLineSlotProps> = ({ id }) => {
    const { angle, parentDistance } = useRedux((state) => state.lineSlots[id]);
    const dispatcher = useDispatch();
    const isHoveredSlot = useRedux((state) => state.hovering)
        .map((it) => it === id)
        .unwrapOr(false);

    const { isHovered: isHoveredConnection, toggleHover: toggleConnectionHover } = useHover();

    const { x, y } = calculateTranslation(angle, parentDistance);
    const length = Math.sqrt(x * x + y * y);
    const lineLength = 10;
    const xDir = (lineLength * x) / length;
    const yDir = (lineLength * y) / length;
    const x2 = x + xDir;
    const y2 = y + yDir;

    return (
        <Group x={0} y={0} isHovered={isHoveredSlot || isHoveredConnection}>
            <line x1={x} y1={y} x2={x2} y2={y2} strokeWidth={1} stroke="inherit" />
            <circle
                cx={x}
                cy={y}
                r={5}
                fill="transparent"
                stroke={isHoveredSlot ? 'inherit' : 'none'}
                onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(id)))}
                onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
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
