import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { dragSentence } from '../state/image/ImageThunks';
import { Sentence, UUID } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { setHovering } from '../state/work/WorkActions';
import { selectSentence } from '../state/work/WorkThunks';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps {
    id: UUID;
}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ id }) => {
    const { circle: sentence, isSelected, isHovered } = useCircleSelector<Sentence>(id);
    const dispatch = useAppDispatch();
    const sentenceRef = useRef<SVGCircleElement>(null);

    useDragAndDrop(id, sentenceRef.current, dragSentence);

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
                ref={sentenceRef}
                r={sentence.circle.r}
                lineSlots={sentence.lineSlots}
                filled={false}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(selectSentence(id));
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
