import React, { useRef } from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { dragConsonant, dragVocal } from '../state/image/ImageThunks';
import {
    Circle,
    Consonant,
    ConsonantPlacement,
    ImageType,
    Letter,
    UUID,
    Vocal,
    VocalPlacement,
} from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { selectConsonant, selectVocal } from '../state/work/WorkThunks';
import { calculateTranslation } from '../utils/TextTransforms';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGDot from './SVGDot';

interface LetterProps {
    id: UUID;
}

export const SVGLetter: React.FunctionComponent<LetterProps> = ({ id }) => {
    const letter = useRedux(
        (state) => state.image.circles[id] as Letter,
        (left, right) => left.id === right.id && left.type === right.type
    );

    return letter.type === ImageType.Consonant ? (
        <SVGConsonant id={letter.id} />
    ) : (
        <SVGVocal id={letter.id} parentType={ImageType.Word} />
    );
};

interface ConsonantProps {
    id: UUID;
}

const SVGConsonant: React.FunctionComponent<ConsonantProps> = ({ id }) => {
    const { circle: consonant, isSelected, isHovered } = useCircleSelector<Consonant>(id);
    const wordRadius = useRedux((state) => state.image.circles[consonant.parentId]!.circle.r);
    const consonantRef = useRef<SVGCircleElement>(null);

    const isCut = [ConsonantPlacement.DeepCut, ConsonantPlacement.ShallowCut].includes(consonant.placement);

    useDragAndDrop(id, consonantRef.current, dragConsonant);

    const vocalPlacement = useRedux((state) => {
        if (consonant.vocal) {
            const vocal = state.image.circles[consonant.vocal] as Vocal;
            return vocal.placement;
        }

        return undefined;
    });

    return (
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
                id={id}
                select={selectConsonant}
                ref={consonantRef}
                r={consonant.circle.r}
                lineSlots={consonant.lineSlots}
                filled={false}
                fill="transparent"
                stroke={isCut ? 'none' : 'inherit'}
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
            {consonant.vocal &&
                (vocalPlacement === VocalPlacement.Outside ? (
                    <Group
                        angle={0}
                        distance={consonant.circle.distance}
                        anglePlacement={AnglePlacement.Relative}
                        reverse={true}
                    >
                        <SVGVocal id={consonant.vocal} parentType={ImageType.Word} />
                    </Group>
                ) : (
                    <SVGVocal id={consonant.vocal} parentType={ImageType.Consonant} />
                ))}
        </Group>
    );
};

interface VocalProps {
    id: UUID;
    parentType: ImageType.Word | ImageType.Consonant;
}

const SVGVocal: React.FunctionComponent<VocalProps> = ({ id, parentType }) => {
    const { circle: vocal, isSelected, isHovered } = useCircleSelector<Vocal>(id);
    const vocalRef = useRef<SVGCircleElement>(null);

    useDragAndDrop(id, vocalRef.current, dragVocal);

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
                id={id}
                select={selectVocal}
                ref={vocalRef}
                r={vocal.circle.r}
                lineSlots={vocal.lineSlots}
                filled={false}
                fill="transparent"
                stroke="inherit"
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
