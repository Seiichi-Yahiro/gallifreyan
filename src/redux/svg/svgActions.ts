import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId, WordId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');
const calculateCircleIntersections = createAction<WordId>(
    'SVG/CALCULATE_CIRCLE_INTERSECTIONS',
);

const setHover = createAction<CircleId | LineSlotId | null>('SVG/SET_HOVER');

const setSelection = createAction<CircleId | LineSlotId | null>(
    'SVG/SET_SELECTION',
);

const svgActions = {
    reset,
    calculateCircleIntersections,
    setHover,
    setSelection,
};

export default svgActions;
