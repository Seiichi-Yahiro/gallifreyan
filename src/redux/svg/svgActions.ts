import type { PolarCoordinate } from '@/math/polar';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId, WordId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');
const calculateCircleIntersections = createAction<WordId>(
    'SVG/CALCULATE_CIRCLE_INTERSECTIONS',
);

const setCircle = createAction<{
    id: CircleId;
    radius?: number;
    position?: Partial<PolarCoordinate>;
}>('SVG/SET_CIRCLE');

const setLineSlotPosition = createAction<{
    id: LineSlotId;
    position: Partial<PolarCoordinate>;
}>('SVG/SET_LINE_SLOT_ANGLE');

const svgActions = {
    reset,
    calculateCircleIntersections,
    setCircle,
    setLineSlotPosition,
};

export default svgActions;
