import React, { useCallback } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { Sentence, UUID } from '../state/image/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/work/WorkActions';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps {
    id: UUID;
}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ id }) => {
    const sentence = useRedux((state) => state.image.circles[id]) as Sentence;
    const dispatch = useAppDispatch();
    const isHovered = useIsHoveredSelector(id);
    const isSelected = useIsSelectedSelector(id);

    return (
        <Group
            angle={sentence.circle.angle}
            distance={sentence.circle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-sentence"
        >
            <SVGCircle
                r={sentence.circle.r}
                lineSlots={sentence.lineSlots}
                filled={false}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {sentence.words.map((wordId) => (
                <SVGWord key={wordId} id={wordId} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
