import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const setHover = createAction<CircleId | LineSlotId | null>('MAIN/SET_HOVER');

const setSelection = createAction<CircleId | LineSlotId | null>(
    'MAIN/SET_SELECTION',
);

const setDragging = createAction<boolean>('MAIN/SET_DRAGGING');

const actions = {
    setHover,
    setSelection,
    setDragging,
};

export default actions;
