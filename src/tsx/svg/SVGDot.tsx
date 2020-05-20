import React from 'react';
import useHover from '../hooks/useHover';
import { useRedux } from '../state/AppStore';
import { UUID } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';

interface DotProps {
    id: UUID;
}

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const dotCircle = useRedux((state) => state.circles[id]);
    const { isHovered, toggleHover } = useHover();

    const { x, y } = calculateTranslation(dotCircle.angle, dotCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={dotCircle.r}
                lineSlots={[]}
                fill="inherit"
                stroke="inherit"
                filled={dotCircle.filled}
                onMouseEnter={toggleHover(true)}
                onMouseLeave={toggleHover(false)}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
