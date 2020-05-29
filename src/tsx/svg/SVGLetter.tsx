import React, { useCallback } from 'react';
import { setHoveringAction, setSelectionAction, useRedux } from '../state/AppStore';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { Consonant, UUID, Vocal } from '../state/StateTypes';
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
        const consonantCircle = useRedux((state) => state.circles[circleId]);
        const dispatcher = useDispatch();
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
                    onClick={useCallback(() => {
                        if (!isSelected) {
                            dispatcher(setSelectionAction(circleId));
                        }
                    }, [circleId, isSelected])}
                    onMouseEnter={useCallback(() => dispatcher(setHoveringAction(circleId)), [circleId])}
                    onMouseLeave={useCallback(() => dispatcher(setHoveringAction()), [])}
                />
                {children && (
                    <Group x={-x} y={-y}>
                        {children}
                    </Group>
                )}
                {dots.map((dot) => (
                    <SVGDot key={dot} id={dot} />
                ))}
                <Group x={-x} y={-y}>
                    {vocal
                        .map((vocal) => (
                            <SVGVocal key={vocal.circleId} {...vocal} fill="transparent" stroke="inherit" />
                        ))
                        .asNullable()}
                </Group>
            </Group>
        );
    }
);

interface VocalProps extends Vocal, LetterProps {}

export const SVGVocal: React.FunctionComponent<VocalProps> = React.memo(({ circleId, fill, stroke, lineSlots }) => {
    const vocalCircle = useRedux((state) => state.circles[circleId]);
    const dispatcher = useDispatch();
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
                onClick={useCallback(() => {
                    if (!isSelected) {
                        dispatcher(setSelectionAction(circleId));
                    }
                }, [circleId, isSelected])}
                onMouseEnter={useCallback(() => dispatcher(setHoveringAction(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatcher(setHoveringAction()), [])}
            />
        </Group>
    );
});

interface ConsonantCutMaskProps extends LetterProps {
    circleId: UUID;
}

export const SVGConsonantCutMask: React.FunctionComponent<ConsonantCutMaskProps> = React.memo(
    ({ circleId, fill, stroke }) => {
        const letterCircle = useRedux((state) => state.circles[circleId]);

        const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

        return <circle cx={x} cy={y} r={letterCircle.r} fill={fill} stroke={stroke} />;
    }
);
