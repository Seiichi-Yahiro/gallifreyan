import { Paper, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import useComplexState from '../hooks/useComplexState';
import useEventListener from '../hooks/useEventListener';
import { useRedux } from '../hooks/useRedux';
import { updateSvgPanZoomTool, updateSvgPanZoomValue } from '../state/svgPanZoom/SvgPanZoomActions';
import { setSelection } from '../state/work/WorkActions';
import SVGSentence from './SVGSentence';
import { ReactSVGPanZoom, POSITION_LEFT, Value, Tool, ToolbarPosition } from 'react-svg-pan-zoom';

interface SVGViewProps {}

const SVGView: React.FunctionComponent<SVGViewProps> = () => {
    const viewBoxRef = useRef<HTMLDivElement>(null);
    const [viewBox, setViewBox] = useComplexState({ width: 0, height: 0 });

    const calculateViewerSize = () => {
        if (viewBoxRef.current) {
            const { width, height } = viewBoxRef.current.getBoundingClientRect();
            setViewBox({ width, height });
        }
    };

    useEffect(() => {
        calculateViewerSize();
    }, []);

    useEventListener('resize', (_) => calculateViewerSize(), window);

    return (
        <Paper variant="outlined" ref={viewBoxRef} className="app__svg-view">
            {viewBoxRef.current && <SVG width={viewBox.width} height={viewBox.height} />}
        </Paper>
    );
};

interface SVGProps {
    width: number;
    height: number;
}

const SVG: React.FunctionComponent<SVGProps> = ({ width, height }) => {
    const dispatch = useAppDispatch();
    const { value, tool } = useRedux((state) => state.svgPanZoom);
    const theme = useTheme();

    const viewerRef = useRef<ReactSVGPanZoom>(null);

    const rootCircleId = useRedux((state) => state.image.rootCircleId);
    const size = useRedux((state) => state.image.svgSize);

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.fitToViewer();
        }
    }, []);

    const selection = useRedux((state) => state.work.selection);
    const deselect = () => {
        if (selection) {
            dispatch(setSelection());
        }
    };

    const onChangeValue = (value: Value) => dispatch(updateSvgPanZoomValue(value));

    const onChangeTool = (tool: Tool) => dispatch(updateSvgPanZoomTool(tool));

    const strokeColor = theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white;

    return (
        <ReactSVGPanZoom
            ref={viewerRef}
            background={theme.palette.action.disabledBackground}
            miniatureProps={{
                background: theme.palette.action.disabledBackground,
                position: 'left',
                width: 100,
                height: 80,
            }}
            SVGBackground={theme.palette.background.paper}
            width={width}
            height={height}
            value={value}
            tool={tool}
            detectAutoPan={false}
            toolbarProps={
                { position: POSITION_LEFT, activeToolColor: theme.palette.primary.main } as {
                    position: ToolbarPosition; // TODO remove this type cast when types include activeToolColor
                }
            }
            onClick={deselect}
            onChangeValue={onChangeValue}
            onChangeTool={onChangeTool}
        >
            <svg width={size} height={size}>
                <g
                    style={{ transform: `translate(${size / 2}px, ${size / 2}px)` }}
                    stroke={strokeColor}
                    fill={strokeColor}
                >
                    {rootCircleId && <SVGSentence id={rootCircleId} />}
                </g>
            </svg>
        </ReactSVGPanZoom>
    );
};

export default SVGView;
