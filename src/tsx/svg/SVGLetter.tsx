import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { Letter, UUID } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGDot from './SVGDot';
import { useDispatch } from 'react-redux';
import Maybe from '../utils/Maybe';

interface LetterProps extends Letter {
    fill: string;
    stroke: string;
    children?: React.ReactNode;
}

const SVGLetter: React.FunctionComponent<LetterProps & { dots?: UUID[] }> = ({
    circleId,
    dots = [],
    fill,
    stroke,
    children,
    lineSlots,
}) => {
    const letterCircle = useRedux((state) => state.circles[circleId]);
    const dispatcher = useDispatch();
    const isHovered = useRedux((state) => state.hovering)
        .map((it) => it === circleId)
        .unwrapOr(false);

    const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={letterCircle.r}
                lineSlots={lineSlots}
                fill={fill}
                stroke={stroke}
                onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(circleId)))}
                onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
            />
            {children && (
                <Group x={-x} y={-y}>
                    {children}
                </Group>
            )}
            {dots.map((dot) => (
                <SVGDot key={dot} id={dot} />
            ))}
        </Group>
    );
};

export const SVGLetterMask: React.FunctionComponent<LetterProps> = React.memo(({ circleId, fill, stroke }) => {
    const letterCircle = useRedux((state) => state.circles[circleId]);

    const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

    return <circle cx={x} cy={y} r={letterCircle.r} fill={fill} stroke={stroke} />;
});

export default React.memo(SVGLetter);
