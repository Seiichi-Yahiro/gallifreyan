import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { updateCircleData } from '../state/ImageState';
import { Consonant, ConsonantPlacement, UUID, Vocal } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import { calculateTranslation } from '../utils/TextTransforms';
import Group, { AnglePlacement } from './Group';
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
    const consonantRef = useRef<SVGCircleElement>(null);

    const isCut = [ConsonantPlacement.DeepCut, ConsonantPlacement.ShallowCut].includes(placement);

    const onMouseDown = useDragAndDrop(
        circleId,
        consonantRef,
        { parentDistance: consonantCircle.parentDistance, angle: consonantCircle.angle },
        (positionData) => dispatch(updateCircleData({ id: circleId, ...positionData }))
    );

    return (
        <Group
            angle={consonantCircle.angle}
            parentDistance={consonantCircle.parentDistance}
            anglePlacement={AnglePlacement.Relative}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-consonant"
        >
            {/*This will be invisible if isCut but it is still used to handle mouse events*/}
            <SVGCircle
                ref={consonantRef}
                r={consonantCircle.r}
                parentAngle={consonantCircle.angle}
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
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {/*This will render the circle arc cutting into the word circle*/}
            {isCut && (
                <Group
                    angle={consonantCircle.angle}
                    parentDistance={consonantCircle.parentDistance}
                    anglePlacement={AnglePlacement.Relative}
                    reverse={true}
                    className="group-consonant__arc"
                >
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
                <SVGDot key={dot} id={dot} parentAngle={consonantCircle.angle} />
            ))}
            {vocal && <SVGVocal {...vocal} parentAngle={consonantCircle.angle} />}
        </Group>
    );
});

interface VocalProps extends Vocal {
    parentAngle?: number;
}

export const SVGVocal: React.FunctionComponent<VocalProps> = React.memo(({ circleId, lineSlots, parentAngle }) => {
    const vocalCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);
    const vocalRef = useRef<SVGCircleElement>(null);

    const onMouseDown = useDragAndDrop(
        circleId,
        vocalRef,
        { parentDistance: vocalCircle.parentDistance, angle: vocalCircle.angle, parentAngle },
        (positionData) => dispatch(updateCircleData({ id: circleId, ...positionData }))
    );

    return (
        <Group
            angle={vocalCircle.angle}
            parentDistance={vocalCircle.parentDistance}
            anglePlacement={parentAngle ? AnglePlacement.Absolute : AnglePlacement.Relative}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-vocal"
        >
            <SVGCircle
                ref={vocalRef}
                r={vocalCircle.r}
                parentAngle={parentAngle ?? vocalCircle.angle}
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
                onMouseDown={onMouseDown}
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
