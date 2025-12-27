import type { PolarCoordinate } from '@/math/polar';
import ids, { type DotId, type LetterId, type WordId } from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import { svgActions } from '@/redux/svg/svgSlice';
import type { CircleId } from '@/redux/svg/svgTypes';
import { LetterPlacement } from '@/redux/text/letterTypes';
import { match } from 'ts-pattern';

const setCirclePosition =
    (id: CircleId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, _getState) => {
        match(id)
            .when(ids.sentence.is, (_sentenceId) => {
                // do nothing for now
            })
            .when(ids.word.is, (wordId) => {
                dispatch(svgThunks.wordPosition(wordId, position));
            })
            .when(ids.letter.is, (letterId) => {
                dispatch(svgThunks.letterPosition(letterId, position));
            })
            .when(ids.dot.is, (dotId) => {
                dispatch(svgThunks.dotPosition(dotId, position));
            })
            .exhaustive();
    };

const setCircleRadius =
    (id: CircleId, radius: number): AppThunkAction =>
    (dispatch, _getState) => {
        match(id)
            .when(ids.sentence.is, (_sentenceId) => {
                // do nothing for now
            })
            .when(ids.word.is, (wordId) => {
                dispatch(svgThunks.wordRadius(wordId, radius));
            })
            .when(ids.letter.is, (letterId) => {
                dispatch(svgThunks.letterRadius(letterId, radius));
            })
            .when(ids.dot.is, (dotId) => {
                dispatch(svgThunks.dotRadius(dotId, radius));
            })
            .exhaustive();
    };

const wordRadius =
    (id: WordId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letterIds = state.text.elements[id].letters;
        const currentCircle = state.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));

        for (const letterId of letterIds) {
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
    };

const wordPosition =
    (id: WordId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.setCircle({ id, position }));
    };

const letterRadius =
    (id: LetterId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[id];
        const currentCircle = state.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

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
                    radius,
                    position: {
                        distance: newDistance,
                    },
                }),
            );
        } else {
            dispatch(svgActions.setCircle({ id, radius }));
        }

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
    };

const letterPosition =
    (id: LetterId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const placement = state.text.elements[id].letter.placement;

        if (placement === LetterPlacement.OnLine) {
            dispatch(
                svgActions.setCircle({
                    id,
                    position: { angle: position.angle },
                }),
            );
        } else {
            dispatch(svgActions.setCircle({ id, position }));
        }
    };

const dotRadius =
    (id: DotId, radius: number): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.setCircle({ id, radius }));
    };

const dotPosition =
    (id: DotId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.setCircle({ id, position }));
    };

const svgThunks = {
    wordRadius,
    wordPosition,
    letterRadius,
    letterPosition,
    dotRadius,
    dotPosition,
    setCirclePosition,
    setCircleRadius,
};

export default svgThunks;
