import type { CircleId, PositionData } from '@/redux/svg/svgTypes';
import type { LineSlotId, WordId } from '@/redux/text/ids';
import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');
const calculateCircleIntersections = createAction<WordId>(
    'SVG/CALCULATE_CIRCLE_INTERSECTIONS',
);

const setCirclePositionData = createAction<{
    id: CircleId;
    position: Partial<PositionData>;
}>('SVG/SET_CIRCLE_POSITION_DATA');

const setLineSlotPositionData = createAction<{
    id: LineSlotId;
    position: Partial<PositionData>;
}>('SVG/SET_LINE_SLOT_ANGLE');

const svgActions = {
    reset,
    calculateCircleIntersections,
    setCirclePositionData,
    setLineSlotPositionData,
};

export default svgActions;
