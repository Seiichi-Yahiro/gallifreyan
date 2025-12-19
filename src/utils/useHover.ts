import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import { uiActions } from '@/redux/slices/uiSlice';
import type { CircleId } from '@/redux/types/svgTypes';

const useHover = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isHovered = useRedux(
        (state) => state.ui.hovered === id && !state.ui.dragging,
    );

    const onHover = () => {
        dispatch(uiActions.setHover(id));
    };

    const onHoverStop = () => {
        dispatch(uiActions.setHover(null));
    };

    return { isHovered, onHover, onHoverStop };
};

export default useHover;
