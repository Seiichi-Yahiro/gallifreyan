import { CircleIntersectionType } from '@/math/circle';
import { useRedux } from '@/redux/hooks';
import type { DotId, LetterId, SentenceId, WordId } from '@/redux/text/ids';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import React from 'react';

const Svg: React.FC = () => {
    const svgSize = useRedux((state) => state.main.svg.size);
    const sentenceId = useRedux((state) => state.main.text.rootElement);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-full"
            viewBox={`-${svgSize / 2} -${svgSize / 2} ${svgSize} ${svgSize}`}
        >
            {sentenceId && <SvgSentence id={sentenceId} />}
        </svg>
    );
};

interface SvgSentenceProps {
    id: SentenceId;
}

const SvgSentence: React.FC<SvgSentenceProps> = ({ id }) => {
    const words = useRedux((state) => state.main.text.elements[id].words);

    const circle = useRedux((state) => state.main.svg.circles[id]);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            <SvgCircle radius={circle.radius} />
            {words.map((wordId) => (
                <SvgWord key={wordId} id={wordId} />
            ))}
        </SvgGroup>
    );
};

interface SvgWordProps {
    id: WordId;
}

const SvgWord: React.FC<SvgWordProps> = ({ id }) => {
    const letters = useRedux((state) => state.main.text.elements[id].letters);

    const circle = useRedux((state) => state.main.svg.circles[id]);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            {circle.intersections.length > 0 ? (
                <SvgArc radius={circle.radius} arcs={circle.arcs} />
            ) : (
                <SvgCircle radius={circle.radius} />
            )}
            {letters.map((letterId) => (
                <SvgLetter key={letterId} id={letterId} />
            ))}
        </SvgGroup>
    );
};

interface SvgLetterProps {
    id: LetterId;
}

const SvgLetter: React.FC<SvgLetterProps> = ({ id }) => {
    const dots = useRedux((state) => state.main.text.elements[id].dots);

    const circle = useRedux((state) => state.main.svg.circles[id]);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            {circle.intersections.type === CircleIntersectionType.Two ? (
                <SvgArc
                    radius={circle.radius}
                    arcs={circle.intersections.values}
                />
            ) : (
                <SvgCircle radius={circle.radius} />
            )}
            {dots.map((dotId) => (
                <SvgDot key={dotId} id={dotId} />
            ))}
        </SvgGroup>
    );
};

interface SvgDotProps {
    id: DotId;
}

const SvgDot: React.FC<SvgDotProps> = ({ id }) => {
    const circle = useRedux((state) => state.main.svg.circles[id]);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            <SvgCircle radius={circle.radius} filled={true} />
        </SvgGroup>
    );
};

export default React.memo(Svg);
