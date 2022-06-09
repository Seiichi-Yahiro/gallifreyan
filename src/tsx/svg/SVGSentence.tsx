import React, { useRef } from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { dragSentence } from '../state/image/ImageThunks';
import { Sentence, UUID } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { selectSentence } from '../state/work/WorkThunks';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps {
    id: UUID;
}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ id }) => {
    const { circle: sentence, isSelected, isHovered } = useCircleSelector<Sentence>(id);
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
                id={id}
                select={selectSentence}
                ref={sentenceRef}
                r={sentence.circle.r}
                lineSlots={sentence.lineSlots}
                filled={false}
            />
            {sentence.words.map((wordId) => (
                <SVGWord key={wordId} id={wordId} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
