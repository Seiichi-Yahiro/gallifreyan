import React from 'react';
import { useRedux } from '../hooks/useRedux';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { UUID } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { useDispatch } from 'react-redux';
import useHover from '../hooks/useHover';

interface SVGLineSlotProps {
    id: UUID;
}

const SVGLineSlot: React.FunctionComponent<SVGLineSlotProps> = ({ id }) => {
    const { angle, parentDistance } = useRedux((state) => state.image.lineSlots[id]);
    const dispatch = useDispatch();
    const isHoveredSlot = useIsHoveredSelector(id);
    const isSelectedSlot = useIsSelectedSelector(id);

    const { isHovered: isHoveredConnection, toggleHover: toggleConnectionHover } = useHover();

    const { x, y } = calculateTranslation(angle, parentDistance);
    const length = Math.sqrt(x * x + y * y); // TODO what if 0
    const lineLength = 10;
    const xDir = (lineLength * x) / length;
    const yDir = (lineLength * y) / length;
    const x2 = x + xDir;
    const y2 = y + yDir;

    return (
        <Group x={0} y={0} isHovered={isHoveredSlot || isHoveredConnection} isSelected={isSelectedSlot}>
            <line x1={x} y1={y} x2={x2} y2={y2} strokeWidth={1} stroke="inherit" />
            <circle
                cx={x}
                cy={y}
                r={5}
                fill="transparent"
                stroke={isHoveredSlot || isSelectedSlot ? 'inherit' : 'none'}
                onClick={(event) => {
                    if (!isSelectedSlot) {
                        dispatch(setSelectionAction(id));
                    }
                    event.stopPropagation();
                }}
                onMouseEnter={() => dispatch(setHoveringAction(id))}
                onMouseLeave={() => dispatch(setHoveringAction())}
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

export default React.memo(SVGLineSlot);
