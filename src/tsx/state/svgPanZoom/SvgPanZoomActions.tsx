import { createAction } from '@reduxjs/toolkit';
import { Tool, Value } from 'react-svg-pan-zoom';

export const updateSvgPanZoomValue = createAction<Value>('svgPanZoom/updateSvgPanZoomValue');
export const updateSvgPanZoomTool = createAction<Tool>('svgPanZoom/updateSvgPanZoomTool');
