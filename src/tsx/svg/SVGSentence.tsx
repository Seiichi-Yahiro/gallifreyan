import React, { useCallback } from 'react';
import { setHoveringAction, setSelectionAction, useRedux } from '../state/AppStore';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { Sentence } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';
import { useDispatch } from 'react-redux';

interface SentenceProps extends Sentence {}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ circleId, words, lineSlots }) => {
    const sentenceCircle = useRedux((state) => state.circles[circleId]);
    const dispatcher = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);

    const { x, y } = calculateTranslation(sentenceCircle.angle, sentenceCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected}>
            <SVGCircle
                r={sentenceCircle.r}
                filled={sentenceCircle.filled}
                lineSlots={lineSlots}
                onClick={useCallback(() => {
                    if (!isSelected) {
                        dispatcher(setSelectionAction(circleId));
                    }
                }, [circleId, isSelected])}
                onMouseEnter={useCallback(() => dispatcher(setHoveringAction(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatcher(setHoveringAction()), [])}
            />
            {words.map((word) => (
                <SVGWord key={word.circleId} {...word} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
