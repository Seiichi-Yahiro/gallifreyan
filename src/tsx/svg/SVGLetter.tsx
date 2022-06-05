import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { dragConsonant, dragVocal } from '../state/image/ImageThunks';
import { Circle, ImageType, Consonant, ConsonantPlacement, Letter, UUID, Vocal } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { setHovering } from '../state/work/WorkActions';
import { selectConsonant, selectVocal } from '../state/work/WorkThunks';
import { Position } from '../utils/LinearAlgebra';
import { calculateTranslation } from '../utils/TextTransforms';
import AngleConstraints from './AngleConstraints';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGDot from './SVGDot';

interface LetterProps {
    id: UUID;
}

export const SVGLetter: React.FunctionComponent<LetterProps> = ({ id }) => {
    const letter = useRedux((state) => state.image.circles[id]) as Letter;

    if (letter.type === ImageType.Consonant) {
        return <SVGConsonant id={letter.id} />;
    } else {
        return <SVGVocal id={letter.id} parentType={ImageType.Word} />;
    }
};

interface ConsonantProps {
    id: UUID;
}

const SVGConsonant: React.FunctionComponent<ConsonantProps> = ({ id }) => {
    const { circle: consonant, isSelected, isHovered } = useCircleSelector<Consonant>(id);
    const wordRadius = useRedux((state) => state.image.circles[consonant.parentId]!.circle.r);
    const dispatch = useAppDispatch();
    const consonantRef = useRef<SVGCircleElement>(null);
    const consonantAngleConstraints = useRedux((state) =>
        isSelected && state.work.selection!.isDragging ? state.work.selection!.angleConstraints : undefined
    );

    const isCut = [ConsonantPlacement.DeepCut, ConsonantPlacement.ShallowCut].includes(consonant.placement);

    const onMouseDown = useDragAndDrop(id, (event) => {
        if (consonantRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const domRect = consonantRef.current.getBoundingClientRect();

            dispatch(dragConsonant(mousePos, { id, domRect }));
        }
    });

    return (
        <>
            <Group
                angle={consonant.circle.angle}
                distance={consonant.circle.distance}
                anglePlacement={AnglePlacement.Relative}
                isHovered={isHovered}
                isSelected={isSelected}
                className="group-consonant"
            >
                {/*This will be invisible if isCut but it is still used to handle mouse events*/}
                <SVGCircle
                    ref={consonantRef}
                    r={consonant.circle.r}
                    lineSlots={consonant.lineSlots}
                    filled={false}
                    fill="transparent"
                    stroke={isCut ? 'none' : 'inherit'}
                    onClick={useCallback(
                        (event: React.MouseEvent<SVGCircleElement>) => {
                            if (!isSelected) {
                                dispatch(selectConsonant(id));
                            }
                            event.stopPropagation();
                        },
                        [id, isSelected]
                    )}
                    onMouseDown={onMouseDown}
                    onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                    onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
                />
                {/*This will render the circle arc cutting into the word circle*/}
                {isCut && (
                    <Group
                        angle={consonant.circle.angle}
                        distance={consonant.circle.distance}
                        anglePlacement={AnglePlacement.Relative}
                        reverse={true}
                        className="group-consonant__arc"
                    >
                        <mask id={`mask_${id}`}>
                            <SVGConsonantCutMask circle={consonant.circle} fill="#000000" stroke="#ffffff" />
                        </mask>
                        <circle
                            r={wordRadius}
                            fill="inherit"
                            stroke="inherit"
                            mask={`url(#mask_${id})`}
                            style={{ pointerEvents: 'none' }}
                        />
                    </Group>
                )}
                {consonant.dots.map((dotId) => (
                    <SVGDot key={dotId} id={dotId} />
                ))}
                {consonant.vocal && <SVGVocal id={consonant.vocal} parentType={ImageType.Consonant} />}
            </Group>
            {consonantAngleConstraints && <AngleConstraints angleConstraints={consonantAngleConstraints} />}
        </>
    );
};

interface VocalProps {
    id: UUID;
    parentType: ImageType.Word | ImageType.Consonant;
}

const SVGVocal: React.FunctionComponent<VocalProps> = ({ id, parentType }) => {
    const { circle: vocal, isHovered, isSelected } = useCircleSelector<Vocal>(id);
    const dispatch = useAppDispatch();
    const vocalRef = useRef<SVGCircleElement>(null);

    const onMouseDown = useDragAndDrop(id, (event) => {
        if (vocalRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const domRect = vocalRef.current.getBoundingClientRect();

            dispatch(dragVocal(mousePos, { id: id, domRect }));
        }
    });

    return (
        <Group
            angle={vocal.circle.angle}
            distance={vocal.circle.distance}
            anglePlacement={parentType === ImageType.Consonant ? AnglePlacement.Absolute : AnglePlacement.Relative}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-vocal"
        >
            <SVGCircle
                ref={vocalRef}
                r={vocal.circle.r}
                lineSlots={vocal.lineSlots}
                filled={false}
                fill="transparent"
                stroke="inherit"
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(selectVocal(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
        </Group>
    );
};

interface ConsonantCutMaskProps {
    circle: Circle;
    fill: string;
    stroke: string;
}

export const SVGConsonantCutMask: React.FunctionComponent<ConsonantCutMaskProps> = ({ circle, fill, stroke }) => {
    const { x, y } = calculateTranslation(circle.angle, circle.distance);
    return <circle cx={x} cy={y} r={circle.r} fill={fill} stroke={stroke} />;
};

export default React.memo(SVGLetter);
