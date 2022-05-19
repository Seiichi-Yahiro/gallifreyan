import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { moveWord } from '../state/ImageState';
import { ConsonantPlacement, Word } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import { isLetterConsonant, isPlacement } from '../utils/LetterGroups';
import { Position } from '../utils/LinearAlgebra';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import { SVGConsonant, SVGConsonantCutMask, SVGVocal } from './SVGLetter';

interface WordProps extends Word {}

const SVGWord: React.FunctionComponent<WordProps> = ({ circleId, letters, lineSlots }) => {
    const wordCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useAppDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);
    const wordRef = useRef<SVGCircleElement>(null);

    const onMouseDown = useDragAndDrop(circleId, (event) => {
        if (wordRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const domRect = wordRef.current.getBoundingClientRect();

            dispatch(moveWord(circleId, mousePos, domRect, wordCircle));
        }
    });

    return (
        <Group
            angle={wordCircle.angle}
            distance={wordCircle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-word"
        >
            <mask id={`mask_${circleId}`}>
                <circle r={wordCircle.r} fill="#000000" stroke="#ffffff" />
                {letters
                    .filter((letter) =>
                        isPlacement(letter.placement, [ConsonantPlacement.ShallowCut, ConsonantPlacement.DeepCut])
                    )
                    .map((letter) => (
                        <SVGConsonantCutMask key={letter.circleId} {...letter} fill="#000000" stroke="#000000" />
                    ))}
            </mask>
            <SVGCircle
                ref={wordRef}
                r={wordCircle.r}
                lineSlots={lineSlots}
                fill="transparent"
                stroke="inherit"
                mask={`url(#mask_${circleId})`}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(circleId));
                        }
                        event.stopPropagation();
                    },
                    [circleId, isSelected]
                )}
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(circleId)), [circleId])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
            {letters.map((letter) =>
                isLetterConsonant(letter) ? (
                    <SVGConsonant key={letter.circleId} {...letter} parentRadius={wordCircle.r} />
                ) : (
                    <SVGVocal key={letter.circleId} {...letter} />
                )
            )}
        </Group>
    );
};

export default React.memo(SVGWord);
