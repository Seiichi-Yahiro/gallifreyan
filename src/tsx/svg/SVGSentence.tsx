import { useTheme } from '@mui/material';
import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { dragSentence } from '../state/image/ImageThunks';
import { ImageType, Sentence, UUID } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { setHovering } from '../state/work/WorkActions';
import { selectSentence } from '../state/work/WorkThunks';
import { Position } from '../utils/LinearAlgebra';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps {
    id: UUID;
}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ id }) => {
    const theme = useTheme();
    const { circle: sentence, isSelected, isHovered } = useCircleSelector<Sentence>(id);
    const wordAngleConstraints = useRedux((state) =>
        state.work.selection?.type === ImageType.Word && state.work.selection.isDragging
            ? state.work.selection.context.angleConstraints
            : undefined
    );
    const dispatch = useAppDispatch();
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
                            dispatch(selectSentence(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {wordAngleConstraints && (
                <g stroke={theme.palette.error.main} strokeLinecap="round">
                    <line
                        x1={0}
                        y1={0}
                        x2={wordAngleConstraints.minAngleVector.x}
                        y2={wordAngleConstraints.minAngleVector.y}
                    />
                    <line
                        x1={0}
                        y1={0}
                        x2={wordAngleConstraints.maxAngleVector.x}
                        y2={wordAngleConstraints.maxAngleVector.y}
                    />
                </g>
            )}
            {sentence.words.map((wordId) => (
                <SVGWord key={wordId} id={wordId} />
            ))}
        </Group>
    );
};

export default React.memo(SVGSentence);
