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
import {
    add,
    circleIntersections,
    circleLineIntersections,
    length,
    mul,
    normalize,
    rotate,
    sub,
    toRadian,
} from './LinearAlgebra';
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
            return { minDistance: word.circle.r + vocal.circle.r, maxDistance: word.circle.r + vocal.circle.r * 2 };
        case VocalPlacement.Inside:
            return { minDistance: 0, maxDistance: word.circle.r - vocal.circle.r };
    }
};

export const calculateNestedVocalAngleConstraints = (
    vocal: Vocal,
    consonant: Consonant,
    word: Word
): AngleConstraints => {
    switch (vocal.placement) {
        case VocalPlacement.OnLine: {
            const consonantTranslation = calculateTranslation(consonant.circle.angle, consonant.circle.distance);

            let vocalBasedWordRadius;
            switch (consonant.placement) {
                case ConsonantPlacement.DeepCut:
                case ConsonantPlacement.Inside:
                    vocalBasedWordRadius = word.circle.r - vocal.circle.r;
                    break;
                case ConsonantPlacement.ShallowCut:
                case ConsonantPlacement.OnLine:
                    vocalBasedWordRadius = word.circle.r;
                    break;
            }

            const vocalBasedWordCircle = {
                r: vocalBasedWordRadius,
                pos: { x: 0, y: 0 },
            };

            const vocalBasedConsonantCircle = {
                r: vocal.circle.distance,
                pos: consonantTranslation,
            };

            return circleIntersections(vocalBasedWordCircle, vocalBasedConsonantCircle)
                .map((intersections) =>
                    intersections.map((intersection) => {
                        let angle = calculateAngle(intersection, consonantTranslation);
                        angle -= consonant.circle.angle;
                        return adjustAngle(angle);
                    })
                )
                .map<AngleConstraints>(([angle1, angle2]) =>
                    angle1 < angle2 ? { minAngle: angle1, maxAngle: angle2 } : { minAngle: angle2, maxAngle: angle1 }
                )
                .unwrapOr(() => ({ minAngle: 0, maxAngle: 360 }));
        }
        case VocalPlacement.Outside: {
            switch (consonant.placement) {
                case ConsonantPlacement.DeepCut:
                case ConsonantPlacement.ShallowCut:
                case ConsonantPlacement.OnLine: {
                    const consonantTranslation = calculateTranslation(
                        consonant.circle.angle,
                        consonant.circle.distance
                    );

                    const wordCircle = { r: word.circle.r, pos: { x: 0, y: 0 } };

                    const consonantCircle = {
                        r: consonant.circle.r,
                        pos: consonantTranslation,
                    };

                    const [pos1, pos2] = circleIntersections(wordCircle, consonantCircle).unwrap();

                    const angle1 = adjustAngle(calculateAngle(pos1, wordCircle.pos) - consonant.circle.angle);
                    const angle2 = adjustAngle(calculateAngle(pos2, wordCircle.pos) - consonant.circle.angle);

                    return angle1 < angle2
                        ? { minAngle: angle2, maxAngle: angle1 }
                        : { minAngle: angle1, maxAngle: angle2 };
                }
                case ConsonantPlacement.Inside: {
                    return { minAngle: 0, maxAngle: 0 };
                }
            }
        }
        case VocalPlacement.Inside: {
            switch (consonant.placement) {
                case ConsonantPlacement.DeepCut:
                case ConsonantPlacement.ShallowCut: {
                    return calculateConsonantWordIntersectionAngles(consonant, word);
                }
                case ConsonantPlacement.Inside: {
                    return { minAngle: 0, maxAngle: 360 };
                }
                case ConsonantPlacement.OnLine: {
                    const translation = calculateTranslation(consonant.circle.angle, consonant.circle.distance);

                    const wordCircle = { r: word.circle.r, pos: { x: 0, y: 0 } };

                    const consonantCircle = {
                        r: consonant.circle.r,
                        pos: translation,
                    };

                    const [angle1, angle2] = circleIntersections(wordCircle, consonantCircle)
                        .map((intersections) =>
                            intersections
                                .map((intersection) => {
                                    const vocalCircle = { r: vocal.circle.r, pos: intersection };

                                    const [pos1, pos2] = circleIntersections(consonantCircle, vocalCircle).unwrap();

                                    const distanceToWord1 = length(pos1) - wordCircle.r;
                                    const distanceToWord2 = length(pos2) - wordCircle.r;

                                    return distanceToWord1 < distanceToWord2 ? pos1 : pos2;
                                })
                                .map((intersection) => {
                                    let angle = calculateAngle(intersection, consonantCircle.pos);
                                    angle -= consonant.circle.angle;
                                    return adjustAngle(angle);
                                })
                        )
                        .unwrap();

                    return angle1 < angle2
                        ? { minAngle: angle1, maxAngle: angle2 }
                        : { minAngle: angle2, maxAngle: angle1 };
                }
            }
        }
    }
};

export const calculateNestedVocalDistanceConstraints = (
    vocal: Vocal,
    consonant: Consonant,
    word: Word
): DistanceConstraints => {
    switch (vocal.placement) {
        case VocalPlacement.OnLine: {
            switch (consonant.placement) {
                case ConsonantPlacement.Inside: {
                    return { minDistance: 0, maxDistance: consonant.circle.r - vocal.circle.r };
                }
                case ConsonantPlacement.DeepCut: {
                    const maxMaxDistance = consonant.circle.r - vocal.circle.r;

                    const consonantPos = calculateTranslation(consonant.circle.angle, consonant.circle.distance);
                    const direction = rotate({ x: 0, y: 1 }, -toRadian(vocal.circle.angle + consonant.circle.angle));
                    const reducedWordRadius = word.circle.r - vocal.circle.r;

                    const intersection = circleLineIntersections(
                        { r: reducedWordRadius, pos: { x: 0, y: 0 } },
                        { a: consonantPos, b: add(consonantPos, direction) }
                    )
                        .unwrapOr(() => {
                            const vocalPos = add(
                                calculateTranslation(vocal.circle.angle, vocal.circle.distance),
                                consonantPos
                            );
                            const direction = normalize(vocalPos);
                            return [mul(direction, reducedWordRadius), mul(direction, -reducedWordRadius)];
                        })
                        .find((intersection) => {
                            // pointing same direction as direction
                            const dir = normalize(sub(intersection, consonantPos));
                            return length(sub(dir, direction)) < 1e-8;
                        })!;

                    const distanceToIntersection = length(sub(consonantPos, intersection));
                    const maxDistance = Math.min(distanceToIntersection, maxMaxDistance);

                    return {
                        minDistance: 0,
                        maxDistance,
                    };
                }
                case ConsonantPlacement.ShallowCut:
                case ConsonantPlacement.OnLine: {
                    const maxMaxDistance = consonant.circle.r - vocal.circle.r;

                    const consonantPos = calculateTranslation(consonant.circle.angle, consonant.circle.distance);
                    const direction = rotate({ x: 0, y: 1 }, -toRadian(vocal.circle.angle + consonant.circle.angle));

                    const [closeIntersection, farIntersection] = circleLineIntersections(
                        { r: word.circle.r, pos: { x: 0, y: 0 } },
                        { a: consonantPos, b: add(consonantPos, direction) }
                    )
                        .unwrapOr(() => {
                            const vocalPos = add(
                                calculateTranslation(vocal.circle.angle, vocal.circle.distance),
                                consonantPos
                            );
                            const direction = normalize(vocalPos);
                            return [mul(direction, word.circle.r), mul(direction, -word.circle.r)];
                        })
                        .map((intersection) => length(sub(consonantPos, intersection)))
                        .sort((a, b) => a - b);

                    const minDistance = closeIntersection;

                    let maxDistance;

                    if (farIntersection < maxMaxDistance) {
                        maxDistance = farIntersection;
                    } else if (length(add(consonantPos, mul(direction, maxMaxDistance))) - word.circle.r <= 0) {
                        // is constraint inside word
                        maxDistance = maxMaxDistance;
                    } else {
                        maxDistance = minDistance;
                    }

                    return {
                        minDistance,
                        maxDistance,
                    };
                }
            }
        }
        case VocalPlacement.Outside: {
            return { minDistance: word.circle.r + vocal.circle.r, maxDistance: word.circle.r + vocal.circle.r * 2 };
        }
        case VocalPlacement.Inside: {
            return { minDistance: consonant.circle.r, maxDistance: consonant.circle.r };
        }
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
                    return calculateConsonantWordIntersectionAngles(consonant, word);
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

const calculateConsonantWordIntersectionAngles = (consonant: Consonant, word: Word): AngleConstraints => {
    const consonantTranslation = calculateTranslation(consonant.circle.angle, consonant.circle.distance);

    const wordCircle = { r: word.circle.r, pos: { x: 0, y: 0 } };

    const consonantCircle = {
        r: consonant.circle.r,
        pos: consonantTranslation,
    };

    const [pos1, pos2] = circleIntersections(wordCircle, consonantCircle).unwrap();

    const angle1 = adjustAngle(calculateAngle(pos1, consonantCircle.pos) - consonant.circle.angle);
    const angle2 = adjustAngle(calculateAngle(pos2, consonantCircle.pos) - consonant.circle.angle);

    return angle1 < angle2 ? { minAngle: angle1, maxAngle: angle2 } : { minAngle: angle2, maxAngle: angle1 };
};
