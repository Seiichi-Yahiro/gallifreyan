import { useRedux } from '@/redux/hooks';
import type { SentenceId } from '@/redux/ids';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import SvgWord from '@/svg/SvgWord';
import useHover from '@/svg/useHover';
import useSelect from '@/svg/useSelect';
import React from 'react';

interface SvgSentenceProps {
    id: SentenceId;
}

const SvgSentence: React.FC<SvgSentenceProps> = ({ id }) => {
    const words = useRedux((state) => state.text.elements[id].words);

    const circle = useRedux((state) => state.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            <circle
                cx={0}
                cy={0}
                r={circle.radius + 10}
                className="sentence__outer"
            />
            <SvgCircle
                radius={circle.radius}
                className="sentence__inner"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
                isHovered={isHovered}
                isSelected={isSelected}
            />
            {words.map((wordId) => (
                <SvgWord key={wordId} id={wordId} />
            ))}
        </SvgGroup>
    );
};

export default SvgSentence;
