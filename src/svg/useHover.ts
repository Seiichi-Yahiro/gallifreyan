import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgActions from '@/redux/svg/svgActions';
import type { CircleId } from '@/redux/svg/svgTypes';
import { useCallback } from 'react';

const useHover = (id: CircleId) => {
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
