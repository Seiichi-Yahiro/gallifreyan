import type { WordId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');
const calculateCircleIntersections = createAction<WordId>(
    'SVG/CALCULATE_CIRCLE_INTERSECTIONS',
);

const svgActions = {
    reset,
    calculateCircleIntersections,
};

export default svgActions;
