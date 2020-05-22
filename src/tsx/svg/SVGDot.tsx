import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { UUID } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import { useDispatch } from 'react-redux';
import Maybe from '../utils/Maybe';

interface DotProps {
    id: UUID;
}

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const dotCircle = useRedux((state) => state.circles[id]);
    const dispatcher = useDispatch();
    const isHovered = useRedux((state) => state.hovering)
        .map((it) => it === id)
        .unwrapOr(false);

    const { x, y } = calculateTranslation(dotCircle.angle, dotCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={dotCircle.r}
                lineSlots={[]}
                fill="inherit"
                stroke="inherit"
                filled={dotCircle.filled}
                onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(id)))}
                onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
