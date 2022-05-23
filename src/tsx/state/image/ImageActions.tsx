import { createAction } from '@reduxjs/toolkit';
import { Circle, PositionData, Referencable, UUID } from './ImageTypes';

export const convertSentenceText = createAction<string>('image/convertSentenceText');
export const nestWordVocals = createAction<UUID>('image/nestWordVocals');
export const resetAllPositionsAndRadii = createAction('image/resetAllPositionsAndRadii');

export const updateCircleData = createAction<Referencable & { circle: Partial<Circle> }>('image/updateCircleData');
export const updateLineSlotData = createAction<Referencable & { positionData: Partial<PositionData> }>(
    'image/updateLineSlotData'
);
