import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import { historyActions } from '@/redux/history/history.slice';
import { type LineSlotId } from '@/redux/ids';
import type {
    CircleId,
    CirclesDict,
    LineSlot,
    LineSlotDict,
} from '@/redux/svg/svg.types';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

export type SvgSlice = {
    settings: SvgSettings;
    circles: CirclesDict;
    lineSlots: LineSlotDict;
};

export type SvgSettings = {
    size: number;
};

export const createInitialSvgState = (): SvgSlice => ({
    settings: {
        size: 1000,
    },
    circles: {},
    lineSlots: {},
});

const svgSlice = createSlice({
    name: 'svg',
    initialState: createInitialSvgState,
    reducers: {
        setSettings: (state, action: PayloadAction<Partial<SvgSettings>>) => {
            state.settings = { ...state.settings, ...action.payload };
        },
        addCircle: (state, action: PayloadAction<CircleId>) => {
            state.circles[action.payload] = {
                radius: 0,
                position: {
                    distance: 0,
                    angle: mAngle.radian(0),
                },
            };
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
            (state, action) => {
                const load = action.payload.load.svg;

                state.circles = load.circles;
                state.lineSlots = load.lineSlots;
                state.settings = load.settings;
            },
        );
    },
});

export const svgActions = svgSlice.actions;
export default svgSlice.reducer;
