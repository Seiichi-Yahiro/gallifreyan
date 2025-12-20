import { useRedux } from '@/redux/hooks';
import SvgContext from '@/svg/svgContext';
import SvgSentence from '@/svg/SvgSentence';
import React, { useRef } from 'react';
import './Svg.css';

const Svg: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const inverseSvgMatrix = useRef<DOMMatrix>(null);

    const calculateInverseSvgMatrix = () => {
        const ctm = svgRef.current?.getScreenCTM();

        if (!ctm) {
            inverseSvgMatrix.current = null;
            return;
        }

        inverseSvgMatrix.current = ctm.inverse();
    };

    const getInverseSvgMatrix = () => inverseSvgMatrix.current;

    const svgSize = useRedux((state) => state.svg.size);
    const sentenceId = useRedux((state) => state.text.rootElement);

    return (
        <svg
            ref={svgRef}
            id="gallifreyan"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                width: '100%',
                height: '100%',
            }}
            className="touch-pinch-zoom--not-print"
            viewBox={`-${svgSize / 2} -${svgSize / 2} ${svgSize} ${svgSize}`}
        >
            <SvgContext.Provider
                value={{ calculateInverseSvgMatrix, getInverseSvgMatrix }}
            >
                {sentenceId && <SvgSentence id={sentenceId} />}
            </SvgContext.Provider>
        </svg>
    );
};

export default Svg;
