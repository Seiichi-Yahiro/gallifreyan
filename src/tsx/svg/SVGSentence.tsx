import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { dragSentence } from '../state/image/ImageThunks';
import { Sentence, UUID } from '../state/image/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/work/WorkActions';
import { Position } from '../utils/LinearAlgebra';
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
    const sentenceRef = useRef<SVGCircleElement>(null);

    const onMouseDown = useDragAndDrop(id, (event) => {
        if (sentenceRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const domRect = sentenceRef.current.getBoundingClientRect();

            dispatch(dragSentence(mousePos, { id, domRect }));
        }
    });

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
                            dispatch(setSelection({ id, type: sentence.type }));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseDown={onMouseDown}
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
