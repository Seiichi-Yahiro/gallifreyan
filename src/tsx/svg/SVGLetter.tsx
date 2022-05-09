import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRedux } from '../hooks/useRedux';
import { Consonant, ConsonantPlacement, UUID, Vocal } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGDot from './SVGDot';

interface ConsonantProps extends Consonant {
    parentRadius: number;
}

export const SVGConsonant: React.FunctionComponent<ConsonantProps> = React.memo((props) => {
    const { circleId, dots, parentRadius, lineSlots, vocal, placement } = props;

    const consonantCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);

    const isCut = [ConsonantPlacement.DeepCut, ConsonantPlacement.ShallowCut].includes(placement);

    const { x, y } = calculateTranslation(consonantCircle.angle, consonantCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected} className="group-consonant">
            {/*This will be invisible if isCut but it is still used to handle mouse events*/}
            <SVGCircle
                r={consonantCircle.r}
                lineSlots={lineSlots}
                fill="transparent"
                stroke={isCut ? 'none' : 'inherit'}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(circleId));
                        }
                        event.stopPropagation();
                    },
                    [circleId, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHovering(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {/*This will render the circle arc cutting into the word circle*/}
            {isCut && (
                <Group x={-x} y={-y} className="group-consonant__arc">
                    <mask id={`mask_${circleId}`}>
                        <SVGConsonantCutMask {...props} fill="#000000" stroke="#ffffff" />
                    </mask>
                    <circle
                        r={parentRadius}
                        fill="inherit"
                        stroke="inherit"
                        mask={`url(#mask_${circleId})`}
                        style={{ pointerEvents: 'none' }}
                    />
                </Group>
            )}
            {dots.map((dot) => (
                <SVGDot key={dot} id={dot} />
            ))}
            {vocal && (
                <Group key={vocal.circleId} x={-x} y={-y} className="group-consonant__vocal">
                    <SVGVocal {...vocal} />
                </Group>
            )}
        </Group>
    );
});

interface VocalProps extends Vocal {}

export const SVGVocal: React.FunctionComponent<VocalProps> = React.memo(({ circleId, lineSlots }) => {
    const vocalCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);

    const { x, y } = calculateTranslation(vocalCircle.angle, vocalCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected} className="group-vocal">
            <SVGCircle
                r={vocalCircle.r}
                lineSlots={lineSlots}
                fill="transparent"
                stroke="inherit"
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(circleId));
                        }
                        event.stopPropagation();
                    },
                    [circleId, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHovering(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
        </Group>
    );
});

interface ConsonantCutMaskProps {
    fill: string;
    stroke: string;
    circleId: UUID;
}

export const SVGConsonantCutMask: React.FunctionComponent<ConsonantCutMaskProps> = React.memo(
    ({ circleId, fill, stroke }) => {
        const letterCircle = useRedux((state) => state.image.circles[circleId]);

        const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

        return <circle cx={x} cy={y} r={letterCircle.r} fill={fill} stroke={stroke} />;
    }
);
