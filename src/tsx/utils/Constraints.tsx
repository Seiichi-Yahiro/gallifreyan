import { CircleShape, Consonant, ConsonantPlacement, UUID, Word } from '../state/image/ImageTypes';
import { AngleConstraints, DistanceConstraints } from '../state/work/WorkTypes';
import Maybe from './Maybe';

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
            return { minDistance: consonant.circle.distance, maxDistance: consonant.circle.distance };
    }
};
