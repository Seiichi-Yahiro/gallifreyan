import React, { useCallback } from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { useIsHoveredSelector } from '../state/Selectors';
import { Sentence } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';
import { useDispatch } from 'react-redux';
import Maybe from '../utils/Maybe';

interface SentenceProps extends Sentence {}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ circleId, words, lineSlots }) => {
    const sentenceCircle = useRedux((state) => state.circles[circleId]);
    const dispatcher = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);

    const { x, y } = calculateTranslation(sentenceCircle.angle, sentenceCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={sentenceCircle.r}
                filled={sentenceCircle.filled}
                lineSlots={lineSlots}
                onMouseEnter={useCallback(() => dispatcher(setHoveringAction(Maybe.some(circleId))), [circleId])}
                onMouseLeave={useCallback(() => dispatcher(setHoveringAction(Maybe.none())), [])}
            />
            {words.map((word) => (
                <SVGWord key={word.circleId} {...word} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
