import React, { useCallback } from 'react';
import { useRedux } from '../hooks/useRedux';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { Sentence } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';
import { useDispatch } from 'react-redux';

interface SentenceProps extends Sentence {}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ circleId, words, lineSlots }) => {
    const sentenceCircle = useRedux((state) => state.image.circles[circleId]);
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
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatcher(setSelectionAction(circleId));
                        }
                        event.stopPropagation();
                    },
                    [circleId, isSelected]
                )}
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
