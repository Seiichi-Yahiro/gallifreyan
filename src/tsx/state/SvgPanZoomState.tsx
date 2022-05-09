import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tool, Value, TOOL_NONE, MODE_IDLE } from 'react-svg-pan-zoom';

export interface SvgPanZoomState {
    value: Value;
    tool: Tool;
}

const createInitialState = (): SvgPanZoomState => ({
    value: {
        SVGHeight: 0,
        SVGWidth: 0,
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        endX: 0,
        endY: 0,
        f: 0,
        focus: false,
        miniatureOpen: true,
        mode: MODE_IDLE,
        startX: 0,
        startY: 0,
        version: 2,
        viewerHeight: 0,
        viewerWidth: 0,
    },
    tool: TOOL_NONE,
});

export const svgPanZoomSlice = createSlice({
    name: 'svgPanZoom',
    initialState: createInitialState,
    reducers: {
        updateSvgPanZoomValue: (state, { payload }: PayloadAction<Value>) => {
            state.value = payload;
        },
        updateSvgPanZoomTool: (state, { payload }: PayloadAction<Tool>) => {
            state.tool = payload;
        },
    },
});

export const { updateSvgPanZoomValue, updateSvgPanZoomTool } = svgPanZoomSlice.actions;

export default svgPanZoomSlice.reducer;
