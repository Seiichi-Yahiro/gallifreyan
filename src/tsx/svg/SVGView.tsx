import React from 'react';
import { useRedux } from '../state/AppStore';
import SVGSentence from './SVGSentence';
import Camera from '../utils/Camera';

interface SVGViewProps {}

const SVGView: React.FunctionComponent<SVGViewProps> = () => {
    const size = useRedux((state) => state.svgSize);
    const sentences = useRedux((state) => state.sentences);

    return (
        <div className="app__editor">
            <Camera size={size}>
                <svg width={`${size}px`} height={`${size}px`}>
                    <g style={{ transform: 'translate(50%, 50%)' }} stroke="#000000" fill="#000000">
                        {sentences.map((sentence) => (
                            <SVGSentence key={sentence.circleId} {...sentence} />
                        ))}
                    </g>
                </svg>
            </Camera>
        </div>
    );
};

export default SVGView;
