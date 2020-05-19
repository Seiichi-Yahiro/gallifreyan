import React from 'react';
import useHover from '../hooks/useHover';
import { useRedux } from '../state/AppStore';
import { useLineSlotSelector } from '../state/Selectors';
import { Sentence } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps extends Sentence {}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ circleId, words }) => {
    const sentenceCircle = useRedux((state) => state.circles[circleId]);
    const lineSlots = useLineSlotSelector(sentenceCircle.lineSlots);

    const { x, y } = calculateTranslation(sentenceCircle.angle, sentenceCircle.parentDistance);

    const { isHovered, toggleHover } = useHover();

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={sentenceCircle.r}
                filled={sentenceCircle.filled}
                lineSlots={lineSlots}
                onMouseEnter={toggleHover(true)}
                onMouseLeave={toggleHover(false)}
            />
            {words.map((word) => (
                <SVGWord key={word.circleId} {...word} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
