import type { PolarCoordinate } from '@/math/polar';
import type { AppThunkAction } from '@/redux/store';
import svgThunks from '@/redux/svg/svg.thunks';
import type { CircleId } from '@/redux/svg/svg.types';

const applyConstraints = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();

    if (state.text.rootElement === null) {
        return;
    }

    const applyCircleConstraints = <T extends CircleId>(
        id: T,
        radiusThunk: (id: T, radius: number) => AppThunkAction,
        positionThunk: (id: T, position: PolarCoordinate) => AppThunkAction,
    ) => {
        const state = getState();
        const circle = state.svg.circles[id];
        dispatch(radiusThunk(id, circle.radius));
        dispatch(positionThunk(id, circle.position));
    };

    const wordIds = state.text.elements[state.text.rootElement].words;

    for (const wordId of wordIds) {
        applyCircleConstraints(
            wordId,
            svgThunks.wordRadius,
            svgThunks.wordPosition,
        );

        const letterIds = state.text.elements[wordId].letters;

        for (const letterId of letterIds) {
            applyCircleConstraints(
                letterId,
                svgThunks.letterRadius,
                svgThunks.letterPosition,
            );

            const dotIds = state.text.elements[letterId].dots;

            for (const dotId of dotIds) {
                applyCircleConstraints(
                    dotId,
                    svgThunks.dotRadius,
                    svgThunks.dotPosition,
                );
            }
        }
    }
};

const constraintsThunks = {
    applyConstraints,
};

export default constraintsThunks;
