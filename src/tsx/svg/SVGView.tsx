import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import useComplexState from '../hooks/useComplexState';
import useEventListener from '../hooks/useEventListener';
import { useRedux } from '../hooks/useRedux';
import { updateSvgPanZoomToolAction, updateSvgPanZoomValueAction } from '../state/SvgPanZoomStore';
import { setSelectionAction } from '../state/WorkStore';
import SVGSentence from './SVGSentence';
import { ReactSVGPanZoom, POSITION_LEFT, Value, Tool } from 'react-svg-pan-zoom';

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
        <div ref={viewBoxRef} className="app__svg-view">
            {viewBoxRef.current && <SVG width={viewBox.width} height={viewBox.height} />}
        </div>
    );
};

interface SVGProps {
    width: number;
    height: number;
}

const SVG: React.FunctionComponent<SVGProps> = ({ width, height }) => {
    const dispatch = useDispatch();
    const { value, tool } = useRedux((state) => state.svgPanZoom);

    const viewerRef = useRef<ReactSVGPanZoom>(null);

    const size = useRedux((state) => state.image.svgSize);
    const sentence = useRedux((state) => state.image.sentence);

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.fitToViewer();
        }
    }, []);

    const selection = useRedux((state) => state.work.selection);
    const deselect = () => {
        if (selection) {
            dispatch(setSelectionAction());
        }
    };

    const onChangeValue = (value: Value) => dispatch(updateSvgPanZoomValueAction(value));

    const onChangeTool = (tool: Tool) => dispatch(updateSvgPanZoomToolAction(tool));

    return (
        <ReactSVGPanZoom
            ref={viewerRef}
            width={width}
            height={height}
            value={value}
            tool={tool}
            detectAutoPan={false}
            toolbarProps={{ position: POSITION_LEFT }}
            onClick={deselect}
            onChangeValue={onChangeValue}
            onChangeTool={onChangeTool}
        >
            <svg width={size} height={size}>
                <g style={{ transform: `translate(${size / 2}px, ${size / 2}px)` }} stroke="#000000" fill="#000000">
                    <SVGSentence key={sentence.circleId} {...sentence} />
                </g>
            </svg>
        </ReactSVGPanZoom>
    );
};

export default SVGView;
