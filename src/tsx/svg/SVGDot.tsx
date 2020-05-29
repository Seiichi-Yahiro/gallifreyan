import React, { useCallback } from 'react';
import { setHoveringAction, setSelectionAction, useRedux } from '../state/AppStore';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { UUID } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import { useDispatch } from 'react-redux';
import Maybe from '../utils/Maybe';

interface DotProps {
    id: UUID;
}

const lineSlots: UUID[] = [];

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const dotCircle = useRedux((state) => state.circles[id]);
    const dispatcher = useDispatch();
    const isHovered = useIsHoveredSelector(id);
    const isSelected = useIsSelectedSelector(id);

    const { x, y } = calculateTranslation(dotCircle.angle, dotCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected}>
            <SVGCircle
                r={dotCircle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="inherit"
                filled={dotCircle.filled}
                onClick={useCallback(() => {
                    if (!isSelected) {
                        dispatcher(setSelectionAction(Maybe.some(id)));
                    }
                }, [id, isSelected])}
                onMouseEnter={useCallback(() => dispatcher(setHoveringAction(Maybe.some(id))), [id])}
                onMouseLeave={useCallback(() => dispatcher(setHoveringAction(Maybe.none())), [])}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
