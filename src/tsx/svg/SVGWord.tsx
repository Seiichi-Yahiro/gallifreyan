import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { useIsHoveredSelector } from '../state/Selectors';
import { Word } from '../state/StateTypes';
import { isDeepCut, isLetterConsonant, isShallowCut } from '../utils/LetterGroups';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import { SVGConsonant, SVGVocal, SVGConsonantCutMask } from './SVGLetter';
import { useDispatch } from 'react-redux';
import Maybe from '../utils/Maybe';

interface WordProps extends Word {}

const SVGWord: React.FunctionComponent<WordProps> = ({ circleId, letters, lineSlots }) => {
    const wordCircle = useRedux((state) => state.circles[circleId]);
    const dispatcher = useDispatch();
    const isHovered = useIsHoveredSelector(circleId);

    const { x, y } = calculateTranslation(wordCircle.angle, wordCircle.parentDistance);

    return (
        <Group x={x} y={y} isHovered={isHovered}>
            <mask id={`mask_${circleId}`}>
                <circle r={wordCircle.r} fill="#000000" stroke="#ffffff" />
                {letters
                    .filter((letter) => isShallowCut(letter.text) || isDeepCut(letter.text))
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
                onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(circleId)))}
                onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
            />
            {letters.map((letter) => {
                if (isLetterConsonant(letter)) {
                    return isShallowCut(letter.text) || isDeepCut(letter.text) ? (
                        <React.Fragment key={letter.circleId}>
                            <mask id={`mask_${letter.circleId}`}>
                                <SVGConsonantCutMask {...letter} fill="#000000" stroke="#ffffff" />
                            </mask>
                            <SVGConsonant {...letter} fill="transparent" stroke="none">
                                <circle
                                    r={wordCircle.r}
                                    fill="inherit"
                                    stroke="inherit"
                                    mask={`url(#mask_${letter.circleId})`}
                                    style={{ pointerEvents: 'none' }}
                                />
                            </SVGConsonant>
                        </React.Fragment>
                    ) : (
                        <SVGConsonant key={letter.circleId} {...letter} fill="transparent" stroke="inherit" />
                    );
                } else {
                    return <SVGVocal key={letter.circleId} {...letter} fill="transparent" stroke="inherit" />;
                }
            })}
        </Group>
    );
};

export default React.memo(SVGWord);
