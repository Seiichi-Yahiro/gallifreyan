import React, { useCallback } from 'react';
import { useRedux } from '../hooks/useRedux';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { UUID } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import { useDispatch } from 'react-redux';

interface DotProps {
    id: UUID;
}

const lineSlots: UUID[] = [];

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const dotCircle = useRedux((state) => state.image.circles[id]);
    const dispatch = useDispatch();
    const isHovered = useIsHoveredSelector(id);
    const isSelected = useIsSelectedSelector(id);

    const { x, y } = calculateTranslation(dotCircle.angle, dotCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected} className="group-dot">
            <SVGCircle
                r={dotCircle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="inherit"
                filled={dotCircle.filled}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelectionAction(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHoveringAction(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHoveringAction()), [])}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
