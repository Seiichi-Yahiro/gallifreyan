import type { PolarCoordinate } from '@/math/polar';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId, WordId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');
const calculateCircleIntersections = createAction<WordId>(
    'SVG/CALCULATE_CIRCLE_INTERSECTIONS',
);

const setCircleRadius = createAction<{ id: CircleId; radius: number }>(
    'SVG/SET_CIRCLE_RADIUS',
);

const setCirclePositionData = createAction<{
    id: CircleId;
    position: Partial<PolarCoordinate>;
}>('SVG/SET_CIRCLE_POSITION_DATA');

const setLineSlotPositionData = createAction<{
    id: LineSlotId;
    position: Partial<PolarCoordinate>;
}>('SVG/SET_LINE_SLOT_ANGLE');

const svgActions = {
    reset,
    calculateCircleIntersections,
    setCircleRadius,
    setCirclePositionData,
    setLineSlotPositionData,
};

export default svgActions;
