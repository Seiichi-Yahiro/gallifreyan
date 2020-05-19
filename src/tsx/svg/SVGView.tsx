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
                        {/*<mask id="word">
                            <circle r={100} fill="black" stroke="white"/>
                            <circle r={50} fill="black" stroke="black" cy={100}/>
                            <circle r={50} fill="black" stroke="black" cy={-100}/>
                        </mask>
                            <circle r={100} fill="green" stroke="green" mask="url(#word)"/>


                        <mask id="letter1">
                            <circle r={50} fill="black" stroke="white" cy={100}/>
                        </mask>
                            <circle r={100} fill="red" stroke="red" mask="url(#letter1)"/>


                        <mask id="letter2">
                            <circle r={50} fill="black" stroke="white" cy={-100}/>
                        </mask>
                        <circle r={100} fill="blue" stroke="blue" mask="url(#letter2)"/>


                        <circle r={50} fill="transparent" stroke="none" cy={100}/>
                        <circle r={50} fill="transparent" stroke="none" cy={-100}/>*/}

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
