import type { PolarCoordinate } from '@/math/polar';
import type { AppThunkAction } from '@/redux/store';
import svgActions from '@/redux/svg/svgActions';
import type { CircleId } from '@/redux/svg/svgTypes';
import { isLetterId, isWordId } from '@/redux/text/ids';
import { LetterPlacement } from '@/redux/text/letters';
import { match } from 'ts-pattern';

const setCircleRadius =
    (id: CircleId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        let state = getState();
        const currentCircle = state.main.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));

        if (isLetterId(id)) {
            state = getState();
            const letter = state.main.text.elements[id];

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

            const wordId = letter.parent;
            dispatch(svgActions.calculateCircleIntersections(wordId));

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
                const dotDistance =
                    state.main.svg.circles[dotId].position.distance;

                dispatch(
                    svgActions.setCircle({
                        id: dotId,
                        position: {
                            distance: dotDistance + deltaRadius,
                        },
                    }),
                );
            }
        } else if (isWordId(id)) {
            state = getState();
            const lettersIds = state.main.text.elements[id].letters;

            for (const letterId of lettersIds) {
                const letterDistance =
                    state.main.svg.circles[letterId].position.distance;

                dispatch(
                    svgActions.setCircle({
                        id: letterId,
                        position: {
                            distance: letterDistance + deltaRadius,
                        },
                    }),
                );
            }

            dispatch(svgActions.calculateCircleIntersections(id));
        }
    };

const setCirclePosition =
    (id: CircleId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(svgActions.setCircle({ id, position }));

        if (isLetterId(id)) {
            const state = getState();
            const wordId = state.main.text.elements[id].parent;

            dispatch(svgActions.calculateCircleIntersections(wordId));
        }
    };

const svgThunks = {
    setCircleRadius,
    setCirclePosition,
};

export default svgThunks;
