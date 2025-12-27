import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import ids, { type LineSlotId } from '@/redux/ids';
import { historyActions } from '@/redux/slices/historySlice';
import type {
    CircleId,
    CirclesDict,
    LineSlot,
    LineSlotDict,
    PolarCircle,
} from '@/redux/types/svgTypes';
import { TextElementType } from '@/redux/types/textTypes';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import { match } from 'ts-pattern';

export type SvgSlice = {
    size: number;
    circles: CirclesDict;
    lineSlots: LineSlotDict;
};

export const createInitialSvgState = (): SvgSlice => ({
    size: 1000,
    circles: {},
    lineSlots: {},
});

const svgSlice = createSlice({
    name: 'svg',
    initialState: createInitialSvgState,
    reducers: {
        addCircle: (state, action: PayloadAction<CircleId>) => {
            const defaultCircle: PolarCircle = {
                radius: 0,
                position: {
                    distance: 0,
                    angle: mAngle.radian(0),
                },
            };

            match(action.payload)
                .when(ids.sentence.is, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Sentence,
                        ...defaultCircle,
                    };
                })
                .when(ids.word.is, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Word,
                        ...defaultCircle,
                    };
                })
                .when(ids.letter.is, (id) => {
                    state.circles[id] = {
                        type: TextElementType.Letter,
                        ...defaultCircle,
                    };
                })
                .when(ids.dot.is, (id) => {
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
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(historyActions.undo, historyActions.redo),
            (_state, action) => {
                return action.payload.load.svg;
            },
        );
    },
});

export const svgActions = svgSlice.actions;
export default svgSlice.reducer;
