import {
    CircleShape,
    Consonant,
    ConsonantPlacement,
    Dot,
    ImageType,
    LineSlot,
    UUID,
    Vocal,
    VocalDecoration,
    VocalPlacement,
    Word,
} from '../state/image/ImageTypes';
import { AngleConstraints, DistanceConstraints } from '../state/work/WorkTypes';
import { calculateAngle } from './DragAndDrop';
import { circleIntersections } from './LinearAlgebra';
import Maybe from './Maybe';
import { adjustAngle, calculateTranslation } from './TextTransforms';

export const calculateNeighborAngleConstraints = (
    id: UUID,
    parentRadius: number,
    siblings: UUID[],
    circles: Partial<Record<UUID, CircleShape>>
): AngleConstraints => {
    const index = siblings.findIndex((siblingId) => siblingId === id);

    const minAngle = Maybe.of(siblings[index - 1])
        .map((siblingId) => circles[siblingId])
        .map((sibling) => sibling.circle.angle)
        .unwrapOr(0);

    const maxAngle = Maybe.of(siblings[index + 1])
        .map((siblingId) => circles[siblingId])
        .map((letter) => letter.circle.angle)
        .unwrapOr(360);

    return {
        minAngle,
        maxAngle,
    };
};

export const calculateConsonantDistanceConstraints = (consonant: Consonant, word: Word): DistanceConstraints => {
    switch (consonant.placement) {
        case ConsonantPlacement.DeepCut: {
            return {
                minDistance: word.circle.r - consonant.circle.r * 0.95,
                maxDistance: word.circle.r - consonant.circle.r * 0.5,
            };
        }
        case ConsonantPlacement.ShallowCut: {
            return {
                minDistance: word.circle.r,
                maxDistance: word.circle.r + consonant.circle.r * 0.95,
            };
        }
        case ConsonantPlacement.Inside: {
            return { minDistance: 0, maxDistance: word.circle.r - consonant.circle.r };
        }
        case ConsonantPlacement.OnLine:
            return { minDistance: word.circle.r, maxDistance: word.circle.r };
    }
};

export const calculateVocalDistanceConstraints = (vocal: Vocal, word: Word): DistanceConstraints => {
    switch (vocal.placement) {
        case VocalPlacement.OnLine:
            return { minDistance: word.circle.r, maxDistance: word.circle.r };
        case VocalPlacement.Outside:
            return { minDistance: word.circle.r + vocal.circle.r, maxDistance: Infinity };
        case VocalPlacement.Inside:
            return { minDistance: 0, maxDistance: word.circle.r - vocal.circle.r };
    }
};

export const calculateLineSlotAngleConstraints = (
    lineSlot: LineSlot,
    circles: Partial<Record<UUID, CircleShape>>
): AngleConstraints => {
    const parent = circles[lineSlot.parentId] as Exclude<CircleShape, Dot>;

    switch (parent.type) {
        case ImageType.Sentence: {
            return { minAngle: 0, maxAngle: 360 };
        }
        case ImageType.Word: {
            return { minAngle: 0, maxAngle: 360 }; // TODO
        }
        case ImageType.Consonant: {
            const consonant = parent as Consonant;

            switch (consonant.placement) {
                case ConsonantPlacement.Inside:
                case ConsonantPlacement.OnLine: {
                    return { minAngle: 0, maxAngle: 360 };
                }
                case ConsonantPlacement.DeepCut:
                case ConsonantPlacement.ShallowCut: {
                    const word = circles[consonant.parentId] as Word;
                    const translation = calculateTranslation(consonant.circle.angle, consonant.circle.distance);

                    const [pos1, pos2] = circleIntersections(
                        { r: word.circle.r, pos: { x: 0, y: 0 } },
                        {
                            r: consonant.circle.r,
                            pos: translation,
                        }
                    ).unwrap();

                    const angle1 = adjustAngle(calculateAngle(pos1, translation) - consonant.circle.angle);
                    const angle2 = adjustAngle(calculateAngle(pos2, translation) - consonant.circle.angle);

                    return angle1 < angle2
                        ? { minAngle: angle1, maxAngle: angle2 }
                        : { minAngle: angle2, maxAngle: angle1 };
                }
            }
        }
        case ImageType.Vocal: {
            const vocal = parent as Vocal;

            switch (vocal.decoration) {
                case VocalDecoration.None: {
                    return { minAngle: 0, maxAngle: 360 };
                }
                case VocalDecoration.LineInside: {
                    return { minAngle: 90, maxAngle: 270 };
                }
                case VocalDecoration.LineOutside: {
                    return { minAngle: 270, maxAngle: 90 };
                }
            }
        }
    }
};
