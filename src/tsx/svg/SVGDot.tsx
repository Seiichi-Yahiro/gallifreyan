import React from 'react';
import { useRedux } from '../state/AppStore';
import { UUID } from '../state/StateTypes';
import Group from './Group';
import { SVGCircle } from './SVGCircle';

interface DotProps {
    id: UUID;
}

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const dotCircle = useRedux((state) => state.circles[id]);

    return (
        <Group x={dotCircle.x} y={dotCircle.y}>
            <SVGCircle r={dotCircle.r} filled={dotCircle.filled} />
        </Group>
    );
};

export default SVGDot;
