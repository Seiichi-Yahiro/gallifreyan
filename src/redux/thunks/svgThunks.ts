import type { PolarCoordinate } from '@/math/polar';
import ids from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import type { AppThunkAction } from '@/redux/store';
import wordThunks from '@/redux/thunks/wordThunks';
import { LetterPlacement } from '@/redux/types/letterTypes';
import type { CircleId } from '@/redux/types/svgTypes';
import { match } from 'ts-pattern';

const setCircleRadius =
    (id: CircleId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        let state = getState();
        const currentCircle = state.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));

        if (ids.letter.is(id)) {
            state = getState();
            const letter = state.text.elements[id];

            const newDistance = match(letter.letter.placement)
                .with(
                    LetterPlacement.ShallowCut,
                    LetterPlacement.DeepCut,
                    LetterPlacement.Inside,
                    () => currentCircle.position.distance - deltaRadius,
                )
                .with(
                    LetterPlacement.Outside,
                    () => currentCircle.position.distance + deltaRadius,
                )
                .with(LetterPlacement.OnLine, () => null)
                .exhaustive();

            if (newDistance !== null) {
                dispatch(
                    svgActions.setCircle({
                        id,
                        position: {
                            distance: newDistance,
                        },
                    }),
                );
            }

            // TODO make letter specific
            dispatch(
                wordThunks.calculateIntersectionsWithLetters(letter.parent),
            );

            const lineSlots = letter.lineSlots;

            for (const lineSlotId of lineSlots) {
                dispatch(
                    svgActions.setLineSlotPosition({
                        id: lineSlotId,
                        position: { distance: radius },
                    }),
                );
            }

            const dotIds = letter.dots;

            for (const dotId of dotIds) {
                const dotDistance = state.svg.circles[dotId].position.distance;

                dispatch(
                    svgActions.setCircle({
                        id: dotId,
                        position: {
                            distance: dotDistance + deltaRadius,
                        },
                    }),
                );
            }
        } else if (ids.word.is(id)) {
            state = getState();
            const lettersIds = state.text.elements[id].letters;

            for (const letterId of lettersIds) {
                const letterDistance =
                    state.svg.circles[letterId].position.distance;

                dispatch(
                    svgActions.setCircle({
                        id: letterId,
                        position: {
                            distance: letterDistance + deltaRadius,
                        },
                    }),
                );
            }

            dispatch(wordThunks.calculateIntersectionsWithLetters(id));
        }
    };

const setCirclePosition =
    (id: CircleId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(svgActions.setCircle({ id, position }));

        if (ids.letter.is(id)) {
            const wordId = getState().text.elements[id].parent;
            // TODO make letter specific
            dispatch(wordThunks.calculateIntersectionsWithLetters(wordId));
        }
    };

const svgThunks = {
    setCircleRadius,
    setCirclePosition,
};

export default svgThunks;
