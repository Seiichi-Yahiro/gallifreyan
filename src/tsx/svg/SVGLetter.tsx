import React from 'react';
import useHover from '../hooks/useHover';
import { useRedux } from '../state/AppStore';
import { useLineSlotSelector } from '../state/Selectors';
import { Letter } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGDot from './SVGDot';

interface LetterProps extends Letter {
    fill: string;
    stroke: string;
    children?: React.ReactNode;
}

const SVGLetter: React.FunctionComponent<LetterProps> = ({ circleId, dots, fill, stroke, children }) => {
    const letterCircle = useRedux((state) => state.circles[circleId]);
    const lineSlots = useLineSlotSelector(letterCircle.lineSlots);

    const { isHovered, toggleHover } = useHover();

    const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={letterCircle.r}
                lineSlots={lineSlots}
                fill={fill}
                stroke={stroke}
                onMouseEnter={toggleHover(true)}
                onMouseLeave={toggleHover(false)}
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

export const SVGLetterSimple: React.FunctionComponent<LetterProps> = React.memo(({ circleId, fill, stroke }) => {
    const letterCircle = useRedux((state) => state.circles[circleId]);

    const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

    return <circle cx={x} cy={y} r={letterCircle.r} fill={fill} stroke={stroke} />;
});

export default React.memo(SVGLetter);
