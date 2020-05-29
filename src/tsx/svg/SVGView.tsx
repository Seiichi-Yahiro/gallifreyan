import React, { useEffect, useRef } from 'react';
import useComplexState from '../hooks/useComplexState';
import useEventListener from '../hooks/useEventListener';
import { useRedux } from '../hooks/useRedux';
import SVGSentence from './SVGSentence';
import { UncontrolledReactSVGPanZoom, POSITION_LEFT } from 'react-svg-pan-zoom';

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
    const viewerRef = useRef<UncontrolledReactSVGPanZoom>(null);

    const size = useRedux((state) => state.image.svgSize);
    const sentences = useRedux((state) => state.image.sentences);

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.fitToViewer();
        }
    }, []);

    return (
        <UncontrolledReactSVGPanZoom
            ref={viewerRef}
            width={width}
            height={height}
            detectAutoPan={false}
            toolbarProps={{ position: POSITION_LEFT }}
        >
            <svg width={size} height={size}>
                <g style={{ transform: `translate(${size / 2}px, ${size / 2}px)` }} stroke="#000000" fill="#000000">
                    {sentences.map((sentence) => (
                        <SVGSentence key={sentence.circleId} {...sentence} />
                    ))}
                </g>
            </svg>
        </UncontrolledReactSVGPanZoom>
    );
};

export default SVGView;
