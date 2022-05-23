import { createReducer } from '@reduxjs/toolkit';
import { Tool, Value, TOOL_NONE, MODE_IDLE } from 'react-svg-pan-zoom';
import { updateSvgPanZoomTool, updateSvgPanZoomValue } from './SvgPanZoomActions';

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

const reducer = createReducer(createInitialState, (builder) =>
    builder
        .addCase(updateSvgPanZoomValue, (state, { payload }) => {
            state.value = payload;
        })
        .addCase(updateSvgPanZoomTool, (state, { payload }) => {
            state.tool = payload;
        })
);

export default reducer;
