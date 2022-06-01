import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { dragWord } from '../state/image/ImageThunks';
import { ImageType, ConsonantPlacement, Letter, UUID, Word } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { setHovering } from '../state/work/WorkActions';
import { selectWord } from '../state/work/WorkThunks';
import { Position } from '../utils/LinearAlgebra';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGLetter, { SVGConsonantCutMask } from './SVGLetter';

interface WordProps {
    id: UUID;
}

const SVGWord: React.FunctionComponent<WordProps> = ({ id }) => {
    const { circle: word, isHovered, isSelected } = useCircleSelector<Word>(id);
    const dispatch = useAppDispatch();
    const wordRef = useRef<SVGCircleElement>(null);

    const onMouseDown = useDragAndDrop(id, (event) => {
        if (wordRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const domRect = wordRef.current.getBoundingClientRect();

            dispatch(dragWord(mousePos, { id, domRect }));
        }
    });

    return (
        <Group
            angle={word.circle.angle}
            distance={word.circle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-word"
        >
            <mask id={`mask_${id}`}>
                <circle r={word.circle.r} fill="#000000" stroke="#ffffff" />
                {word.letters.map((letterId) => (
                    <SVGLetterCutMask key={letterId} id={letterId} />
                ))}
            </mask>
            <SVGCircle
                ref={wordRef}
                r={word.circle.r}
                lineSlots={word.lineSlots}
                filled={false}
                fill="transparent"
                stroke="inherit"
                mask={`url(#mask_${id})`}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(selectWord(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {word.letters.map((letterId) => (
                <SVGLetter key={letterId} id={letterId} />
            ))}
        </Group>
    );
};

interface SVGLetterCutMaskProps {
    id: UUID;
}

const SVGLetterCutMask: React.FunctionComponent<SVGLetterCutMaskProps> = ({ id }) => {
    const consonant = useRedux((state) => state.image.circles[id]) as Letter;

    if (
        consonant.type === ImageType.Consonant &&
        [ConsonantPlacement.DeepCut, ConsonantPlacement.ShallowCut].includes(consonant.placement)
    ) {
        return <SVGConsonantCutMask circle={consonant.circle} fill="#000000" stroke="#000000" />;
    } else {
        return null;
    }
};

export default React.memo(SVGWord);
