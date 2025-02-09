import type { CircleId } from '@/redux/svg/svgTypes';
import type { WordId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');
const calculateCircleIntersections = createAction<WordId>(
    'SVG/CALCULATE_CIRCLE_INTERSECTIONS',
);

const setHover = createAction<CircleId | null>('SVG/SET_HOVER');

const svgActions = {
    reset,
    calculateCircleIntersections,
    setHover,
};

export default svgActions;
