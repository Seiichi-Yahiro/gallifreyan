import React, { useCallback, useRef } from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { updateCircleData } from '../state/ImageState';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { UUID } from '../state/ImageTypes';
import { setHovering, setSelection } from '../state/WorkState';
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
    const dotRef = useRef<SVGCircleElement>(null);

    const translation = calculateTranslation(dotCircle.angle, dotCircle.parentDistance);

    const onMouseDown = useDragAndDrop(id, dotRef, translation, (positionData) =>
        dispatch(updateCircleData({ id, ...positionData }))
    );

    return (
        <Group x={translation.x} y={translation.y} isHovered={isHovered} isSelected={isSelected} className="group-dot">
            <SVGCircle
                ref={dotRef}
                r={dotCircle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="inherit"
                filled={dotCircle.filled}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
