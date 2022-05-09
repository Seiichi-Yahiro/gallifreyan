import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRedux } from '../hooks/useRedux';
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

    const { x, y } = calculateTranslation(wordCircle.angle, wordCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered} isSelected={isSelected} className="group-word">
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
                r={wordCircle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="#inherit"
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
