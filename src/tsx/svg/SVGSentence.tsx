import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
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
    const isHovered = useRedux((state) => state.hovering)
        .map((it) => it === circleId)
        .unwrapOr(false);

    const { x, y } = calculateTranslation(sentenceCircle.angle, sentenceCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <SVGCircle
                r={sentenceCircle.r}
                filled={sentenceCircle.filled}
                lineSlots={lineSlots}
                onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(circleId)))}
                onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
            />
            {words.map((word) => (
                <SVGWord key={word.circleId} {...word} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
