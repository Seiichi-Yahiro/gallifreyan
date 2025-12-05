import actions from '@/redux/actions';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';

const useHover = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isHovered = useRedux((state) => state.main.hovered === id);

    const onHover = () => {
        dispatch(actions.setHover(id));
    };

    const onHoverStop = () => {
        dispatch(actions.setHover(null));
    };

    return { isHovered, onHover, onHoverStop };
};

export default useHover;
