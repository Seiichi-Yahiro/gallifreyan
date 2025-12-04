import type { AppThunkAction } from '@/redux/store';
import svgActions from '@/redux/svg/svgActions';
import type { CircleId, PositionData } from '@/redux/svg/svgTypes';
import { isLetterId } from '@/redux/text/ids';

const setCirclePositionData =
    (id: CircleId, position: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(svgActions.setCirclePositionData({ id, position }));

        if (isLetterId(id)) {
            const state = getState();
            const wordId = state.main.text.elements[id].parent;

            dispatch(svgActions.calculateCircleIntersections(wordId));
        }
    };

const svgThunks = {
    setCirclePositionData,
};

export default svgThunks;
