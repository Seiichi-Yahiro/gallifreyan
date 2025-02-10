import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgActions from '@/redux/svg/svgActions';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import { useCallback } from 'react';

const useHover = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isHovered = useRedux((state) => state.main.hovered === id);

    const onHover = useCallback(() => {
        dispatch(svgActions.setHover(id));
    }, [dispatch, id]);

    const onHoverStop = useCallback(() => {
        dispatch(svgActions.setHover(null));
    }, [dispatch]);

    return { isHovered, onHover, onHoverStop };
};

export default useHover;
