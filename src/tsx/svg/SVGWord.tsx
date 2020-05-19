import React from 'react';
import useHover from '../hooks/useHover';
import { useRedux } from '../state/AppStore';
import { Word } from '../state/StateTypes';
import { isDeepCut, isShallowCut } from '../utils/LetterGroups';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import SVGLetter, { SVGLetterSimple } from './SVGLetter';

interface WordProps extends Word {}

const SVGWord: React.FunctionComponent<WordProps> = ({ circleId, letters }) => {
    const wordCircle = useRedux((state) => state.circles[circleId]);
    // const wordLineSlots = useLineSlotSelector(wordCircle.lineSlots);

    const { isHovered, toggleHover } = useHover();

    const { x, y } = calculateTranslation(wordCircle.angle, wordCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <mask id={`mask_${circleId}`}>
                <circle r={wordCircle.r} fill="#000000" stroke="#ffffff" />
                {letters
                    .filter((letter) => isShallowCut(letter.text) || isDeepCut(letter.text))
                    .map((letter) => (
                        <SVGLetterSimple key={letter.circleId} {...letter} fill="#000000" stroke="#000000" />
                    ))}
            </mask>
            <circle
                r={wordCircle.r}
                fill="inherit"
                stroke="#inherit"
                mask={`url(#mask_${circleId})`}
                onMouseEnter={toggleHover(true)}
                onMouseLeave={toggleHover(false)}
            />
            {letters.map((letter) =>
                isShallowCut(letter.text) || isDeepCut(letter.text) ? (
                    <React.Fragment key={letter.circleId}>
                        <mask id={`mask_${letter.circleId}`}>
                            <SVGLetterSimple {...letter} fill="#000000" stroke="#ffffff" />
                        </mask>
                        <SVGLetter {...letter} fill="transparent" stroke="none">
                            <circle
                                r={wordCircle.r}
                                fill="inherit"
                                stroke="inherit"
                                mask={`url(#mask_${letter.circleId})`}
                                style={{ pointerEvents: 'none' }}
                            />
                        </SVGLetter>
                    </React.Fragment>
                ) : (
                    <SVGLetter key={letter.circleId} {...letter} fill="transparent" stroke="inherit" />
                )
            )}
        </Group>
    );
};

export default React.memo(SVGWord);
