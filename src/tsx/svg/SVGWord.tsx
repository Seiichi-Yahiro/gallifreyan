import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { Word } from '../state/StateTypes';
import { isDeepCut, isShallowCut } from '../utils/LetterGroups';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGLetter, { SVGLetterSimple } from './SVGLetter';
import { useDispatch } from 'react-redux';
import Maybe from '../utils/Maybe';

interface WordProps extends Word {}

const SVGWord: React.FunctionComponent<WordProps> = ({ circleId, letters, lineSlots }) => {
    const wordCircle = useRedux((state) => state.circles[circleId]);
    const dispatcher = useDispatch();
    const isHovered = useRedux((state) => state.hovering)
        .map((it) => it === circleId)
        .unwrapOr(false);

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
            <SVGCircle
                r={wordCircle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="#inherit"
                mask={`url(#mask_${circleId})`}
                onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(circleId)))}
                onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
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
