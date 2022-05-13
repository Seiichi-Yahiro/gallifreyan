import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { updateCircleData } from '../state/ImageState';
import { ConsonantPlacement, Word } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import { isLetterConsonant, isPlacement } from '../utils/LetterGroups';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import { SVGConsonant, SVGConsonantCutMask, SVGVocal } from './SVGLetter';

interface WordProps extends Word {}

const SVGWord: React.FunctionComponent<WordProps> = ({ circleId, letters, lineSlots }) => {
    const wordCircle = useRedux((state) => state.image.circles[circleId]);
    const dispatch = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);
    const isSelected = useIsSelectedSelector(circleId);
    const wordRef = useRef<SVGCircleElement>(null);

    const translation = calculateTranslation(wordCircle.angle, wordCircle.parentDistance);

    const onMouseDown = useDragAndDrop(circleId, wordRef, translation, (positionData) =>
        dispatch(updateCircleData({ id: circleId, ...positionData }))
    );

    return (
        <Group x={translation.x} y={translation.y} isHovered={isHovered} isSelected={isSelected} className="group-word">
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
