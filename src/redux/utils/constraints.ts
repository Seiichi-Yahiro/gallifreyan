import mAngle from '@/math/angle';
import { createReduxSelector } from '@/redux/hooks';
import ids, { type LetterId, type WordId } from '@/redux/ids';
import type { AppState } from '@/redux/store';
import type {
    DistanceConstraints,
    PositionConstraints,
} from '@/redux/types/constraintTypes';
import { LetterPlacement } from '@/redux/types/letterTypes';
import { match } from 'ts-pattern';

export const calculateWordPositionConstraints = (
    state: Pick<AppState, 'text' | 'svg'>,
    id: WordId,
): PositionConstraints => {
    const word = state.text.elements[id];
    const wordCircle = state.svg.circles[id];
    const sentenceCircle = state.svg.circles[word.parent];
    const wordIds = state.text.elements[word.parent].words;
    const index = wordIds.indexOf(id);

    let minAngle = mAngle.radian(0);
    let maxAngle = mAngle.radian(Math.PI * 2.0);

    if (index > 0) {
        const previousWordId = wordIds[index - 1];
        minAngle = state.svg.circles[previousWordId].position.angle;
    }

    if (index < wordIds.length - 1) {
        const nextWordId = wordIds[index + 1];
        maxAngle = state.svg.circles[nextWordId].position.angle;
    }

    return {
        distance: {
            min: 0,
            max: sentenceCircle.radius - wordCircle.radius,
        },
        angle: {
            min: minAngle,
            max: maxAngle,
        },
    };
};

export const calculateLetterPositionConstraints = (
    state: Pick<AppState, 'text' | 'svg'>,
    id: LetterId,
): PositionConstraints => {
    const letter = state.text.elements[id];
    const letterCircle = state.svg.circles[id];
    const wordCircle = state.svg.circles[letter.parent];
    const placement = letter.letter.placement;
    const letterIds = state.text.elements[letter.parent].letters;
    const index = letterIds.indexOf(id);

    let minAngle = mAngle.radian(0);
    let maxAngle = mAngle.radian(Math.PI * 2.0);

    if (index > 0) {
        const previousWordId = letterIds[index - 1];
        minAngle = state.svg.circles[previousWordId].position.angle;
    }

    if (index < letterIds.length - 1) {
        const nextWordId = letterIds[index + 1];
        maxAngle = state.svg.circles[nextWordId].position.angle;
    }

    const distanceConstraints = match(placement)
        .returnType<DistanceConstraints>()
        .with(LetterPlacement.OnLine, () => {
            return {
                min: wordCircle.radius,
                max: wordCircle.radius,
            };
        })
        .with(LetterPlacement.ShallowCut, () => {
            return {
                min: wordCircle.radius + letterCircle.radius * 0.05,
                max: wordCircle.radius + letterCircle.radius * 0.95,
            };
        })
        .with(LetterPlacement.DeepCut, () => {
            return {
                min: wordCircle.radius - letterCircle.radius * 0.95,
                max: wordCircle.radius - letterCircle.radius * 0.55,
            };
        })
        .with(LetterPlacement.Inside, () => {
            return {
                min: 0,
                max: wordCircle.radius - letterCircle.radius,
            };
        })
        .with(LetterPlacement.Outside, () => {
            return {
                min: wordCircle.radius + letterCircle.radius,
                max:
                    wordCircle.radius +
                    letterCircle.radius +
                    wordCircle.radius * 0.2,
            };
        })
        .exhaustive();

    return {
        distance: distanceConstraints,
        angle: {
            min: minAngle,
            max: maxAngle,
        },
    };
};

export const selectPositionConstraints = createReduxSelector(
    [
        (state: AppState) => state.text,
        (state: AppState) => state.svg,
        (state: AppState) => state.interaction.selected,
    ],
    (text, svg, id): PositionConstraints | null => {
        const state = { text, svg };

        return match(id)
            .with(null, () => null)
            .when(ids.sentence.is, (_sentenceId) => null)
            .when(ids.word.is, (wordId) =>
                calculateWordPositionConstraints(state, wordId),
            )
            .when(ids.letter.is, (letterId) =>
                calculateLetterPositionConstraints(state, letterId),
            )
            .when(ids.dot.is, (_dotId) => null)
            .when(ids.lineSlot.is, (_lineSlotId) => null)
            .exhaustive();
    },
);
