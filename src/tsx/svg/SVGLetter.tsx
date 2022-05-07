import React, { useCallback } from 'react';
import { useRedux } from '../hooks/useRedux';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { Consonant, UUID, Vocal } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGDot from './SVGDot';
import { useDispatch } from 'react-redux';

interface LetterProps {
    fill: string;
    stroke: string;
}

interface ConsonantProps extends Consonant, LetterProps {
    children?: React.ReactNode;
}

export const SVGConsonant: React.FunctionComponent<ConsonantProps> = React.memo(
    ({ circleId, dots, fill, stroke, children, lineSlots, vocal }) => {
        const consonantCircle = useRedux((state) => state.image.circles[circleId]);
        const dispatch = useDispatch();
        const isHovered = useIsHoveredSelector(circleId);
        const isSelected = useIsSelectedSelector(circleId);

        const { x, y } = calculateTranslation(consonantCircle.angle, consonantCircle.parentDistance);

        return (
            <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected}>
                <SVGCircle
                    r={consonantCircle.r}
                    lineSlots={lineSlots}
                    fill={fill}
                    stroke={stroke}
                    onClick={useCallback(
                        (event: React.MouseEvent<SVGCircleElement>) => {
                            if (!isSelected) {
                                dispatch(setSelectionAction(circleId));
                            }
                            event.stopPropagation();
                        },
                        [circleId, isSelected]
                    )}
                    onMouseEnter={useCallback(() => dispatch(setHoveringAction(circleId)), [circleId])}
                    onMouseLeave={useCallback(() => dispatch(setHoveringAction()), [])}
                />
                {children && (
                    <Group x={-x} y={-y}>
                        {children}
                    </Group>
                )}
                {dots.map((dot) => (
                    <SVGDot key={dot} id={dot} />
                ))}
                {vocal
                    .map((vocal) => (
                        <Group key={vocal.circleId} x={-x} y={-y}>
                            <SVGVocal {...vocal} fill="transparent" stroke="inherit" />
                        </Group>
                    ))
                    .asNullable()}
            </Group>
        );
    }
);

interface VocalProps extends Vocal, LetterProps {}

export const SVGVocal: React.FunctionComponent<VocalProps> = React.memo(({ circleId, fill, stroke, lineSlots }) => {
    const vocalCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);

    const { x, y } = calculateTranslation(vocalCircle.angle, vocalCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected}>
            <SVGCircle
                r={vocalCircle.r}
                lineSlots={lineSlots}
                fill={fill}
                stroke={stroke}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelectionAction(circleId));
                        }
                        event.stopPropagation();
                    },
                    [circleId, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHoveringAction(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatch(setHoveringAction()), [])}
            />
        </Group>
    );
});

interface ConsonantCutMaskProps extends LetterProps {
    circleId: UUID;
}

export const SVGConsonantCutMask: React.FunctionComponent<ConsonantCutMaskProps> = React.memo(
    ({ circleId, fill, stroke }) => {
        const letterCircle = useRedux((state) => state.image.circles[circleId]);

        const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

        return <circle cx={x} cy={y} r={letterCircle.r} fill={fill} stroke={stroke} />;
    }
);
