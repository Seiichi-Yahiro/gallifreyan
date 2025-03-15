import actions from '@/redux/actions';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import { useCallback } from 'react';

const useHover = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isHovered = useRedux((state) => state.main.hovered === id);

    const onHover = useCallback(() => {
        dispatch(actions.setHover(id));
    }, [dispatch, id]);

    const onHoverStop = useCallback(() => {
        dispatch(actions.setHover(null));
    }, [dispatch]);

    return { isHovered, onHover, onHoverStop };
};

export default useHover;
