import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import { interactionActions } from '@/redux/interactions/interaction.slice';
import type { CircleId } from '@/redux/svg/svg.types';

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
