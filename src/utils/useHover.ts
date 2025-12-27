import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import { interactionActions } from '@/redux/interactions/interactionSlice';
import type { CircleId } from '@/redux/svg/svgTypes';

const useHover = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isHovered = useRedux(
        (state) =>
            state.interaction.hovered === id && !state.interaction.dragging,
    );

    const onHover = () => {
        dispatch(interactionActions.setHover(id));
    };

    const onHoverStop = () => {
        dispatch(interactionActions.setHover(null));
    };

    return { isHovered, onHover, onHoverStop };
};

export default useHover;
