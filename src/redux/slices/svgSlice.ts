import mAngle from '@/math/angle';
import {
    type CircleIntersections,
    CircleIntersectionType,
    type TwoCircleIntersections,
} from '@/math/circle';
import type { PolarCoordinate } from '@/math/polar';
import {
    isDotId,
    isLetterId,
    isSentenceId,
    isWordId,
    type LetterId,
    type LineSlotId,
    type WordId,
} from '@/redux/ids';
import type {
    Arc,
    CircleId,
    CirclesDict,
    LineSlot,
    LineSlotDict,
    PolarCircle,
} from '@/redux/types/svgTypes';
import { TextElementType } from '@/redux/types/textTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { match } from 'ts-pattern';

export type SvgSlice = {
    size: number;
    circles: CirclesDict;
    lineSlots: LineSlotDict;
};

const createInitialState = (): SvgSlice => ({
    size: 1000,
    circles: {},
    lineSlots: {},
});

const svgSlice = createSlice({
    name: 'svg',
    initialState: createInitialState,
    reducers: {
        addCircle: (state, action: PayloadAction<CircleId>) => {
            const defaultCircle: PolarCircle = {
                radius: 0,
                position: {
                    distance: 0,
                    angle: mAngle.degree(0),
                },
            };

            match(action.payload)
                .when(isSentenceId, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Sentence,
                        ...defaultCircle,
                    };
                })
                .when(isWordId, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Word,
                        ...defaultCircle,
                        intersections: [],
                        arcs: [],
                    };
                })
                .when(isLetterId, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Letter,
                        intersections: {
                            type: CircleIntersectionType.None,
                        },
                        ...defaultCircle,
                    };
                })
                .when(isDotId, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Dot,
                        ...defaultCircle,
                    };
                })
                .exhaustive();
        },
        removeCircle: (state, action: PayloadAction<CircleId>) => {
            delete state.circles[action.payload];
        },
        setCircle: (
            state,
            action: PayloadAction<{
                id: CircleId;
                radius?: number;
                position?: Partial<PolarCoordinate>;
            }>,
        ) => {
            const circle = state.circles[action.payload.id];

            if (action.payload.radius !== undefined) {
                circle.radius = action.payload.radius;
            }

            if (action.payload.position !== undefined) {
                circle.position = {
                    ...circle.position,
                    ...action.payload.position,
                };
            }
        },
        setWordIntersections: (
            state,
            action: PayloadAction<{
                id: WordId;
                intersections: TwoCircleIntersections['values'][];
                arcs: Arc[];
            }>,
        ) => {
            const circle = state.circles[action.payload.id];

            circle.intersections = action.payload.intersections;
            circle.arcs = action.payload.arcs;
        },
        setLetterIntersections: (
            state,
            action: PayloadAction<{
                id: LetterId;
                intersections: CircleIntersections;
            }>,
        ) => {
            state.circles[action.payload.id].intersections =
                action.payload.intersections;
        },
        addLineSlot: (
            state,
            action: PayloadAction<{ id: LineSlotId; lineSlot: LineSlot }>,
        ) => {
            state.lineSlots[action.payload.id] = action.payload.lineSlot;
        },
        removeLineSlot: (state, action: PayloadAction<LineSlotId>) => {
            delete state.lineSlots[action.payload];
        },
        setLineSlotPosition: (
            state,
            action: PayloadAction<{
                id: LineSlotId;
                position: Partial<PolarCoordinate>;
            }>,
        ) => {
            const currentPosition = state.lineSlots[action.payload.id].position;

            state.lineSlots[action.payload.id].position = {
                ...currentPosition,
                ...action.payload.position,
            };
        },
    },
});

export const svgActions = svgSlice.actions;
export default svgSlice.reducer;
