import React, { useCallback } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { Sentence } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps extends Sentence {}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ circleId, words, lineSlots }) => {
    const sentenceCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useAppDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);

    return (
        <Group
            angle={sentenceCircle.angle}
            distance={sentenceCircle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-sentence"
        >
            <SVGCircle
                r={sentenceCircle.r}
                lineSlots={lineSlots}
                filled={false}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(circleId));
                        }
                        event.stopPropagation();
                    },
                    [circleId, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHovering(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {words.map((word) => (
                <SVGWord key={word.circleId} {...word} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
