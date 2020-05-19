import React from 'react';
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

    const { x, y } = calculateTranslation(dotCircle.angle, dotCircle.parentDistance);

    return (
        <Group x={x} y={y}>
            <SVGCircle r={dotCircle.r} filled={dotCircle.filled} lineSlots={[]} />
        </Group>
    );
};

export default SVGDot;
