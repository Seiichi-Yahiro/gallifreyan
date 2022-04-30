import { createActionCreator, createReducer } from 'deox';
import { produce } from 'immer';
import { Tool, Value, TOOL_NONE, MODE_IDLE } from 'react-svg-pan-zoom';

export interface SvgPanZoomStore {
    value: Value;
    tool: Tool;
}

const defaultState: SvgPanZoomStore = {
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
};

export const updateSvgPanZoomValueAction = createActionCreator(
    'UPDATE_SVGPANZOOM_VALUE',
    (resolve) => (value: Value) => resolve(value)
);

export const updateSvgPanZoomToolAction = createActionCreator(
    'UPDATE_SVGPANZOOM_TOOL',
    (resolve) => (tool: Tool) => resolve(tool)
);

export const svgPanZoomReducer = createReducer(defaultState, (handle) => [
    handle(updateSvgPanZoomValueAction, (state, { payload: value }) =>
        produce(state, (draft) => {
            draft.value = value;
        })
    ),
    handle(updateSvgPanZoomToolAction, (state, { payload: tool }) =>
        produce(state, (draft) => {
            draft.tool = tool;
        })
    ),
]);
