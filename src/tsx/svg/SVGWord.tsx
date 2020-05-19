import React, { useMemo } from 'react';
import { useRedux } from '../state/AppStore';
import { useLineSlotSelector } from '../state/Selectors';
import { AppStoreState, Letter, Word } from '../state/StateTypes';
import { isDeepCut, isShallowCut } from '../utils/LetterGroups';
import { calculateTranslation } from '../utils/TextTransforms';
import Group from './Group';
import { SVGCircle, SVGMaskedCircle } from './SVGCircle';
import SVGLetter from './SVGLetter';
import { createSelector } from 'reselect';
import { partition } from 'lodash';

const createLetterPartitionSelector = () =>
    createSelector(
        (state: AppStoreState) => state.circles,
        (_state: AppStoreState, letters: Letter[]) => letters,
        (circles, letters) => {
            const [cuttingLetters, normalLetters] = partition(
                letters,
                (letter) => isShallowCut(letter.text) || isDeepCut(letter.text)
            );

            const cut = cuttingLetters.map((letter) => {
                const letterCircle = circles[letter.circleId];
                const { x, y } = calculateTranslation(letterCircle.angle, letterCircle.parentDistance);

                return (
                    <circle key={letter.circleId} cx={x} cy={y} r={letterCircle.r} fill="#000000" stroke="#ffffff" />
                );
            });

            const normal = normalLetters
                .map((letter) => <SVGLetter key={letter.circleId} isCutting={false} {...letter} />)
                .concat(
                    cuttingLetters.map((letter) => <SVGLetter key={letter.circleId} {...letter} isCutting={true} />)
                );

            return [cut, normal];
        }
    );

interface WordProps extends Word {}

const SVGWord: React.FunctionComponent<WordProps> = ({ circleId, letters }) => {
    const wordCircle = useRedux((state) => state.circles[circleId]);
    const wordLineSlots = useLineSlotSelector(wordCircle.lineSlots);

    const letterPartitionSelector = useMemo(createLetterPartitionSelector, []);
    const [clippingLetters, normalLetters] = useRedux((state) => letterPartitionSelector(state, letters));

    const { x, y } = calculateTranslation(wordCircle.angle, wordCircle.parentDistance);

    const maskId = `cut_${wordCircle.id}`;

    return (
        <Group x={x} y={y}>
            {clippingLetters.length === 0 ? (
                <>
                    <SVGCircle r={wordCircle.r} filled={wordCircle.filled} lineSlots={wordLineSlots} />
                    {normalLetters}
                </>
            ) : (
                <>
                    <mask id={maskId}>
                        <circle cx={0} cy={0} r={wordCircle.r} fill="#000000" stroke="#ffffff" />
                        {clippingLetters}
                    </mask>
                    <SVGMaskedCircle r={wordCircle.r} maskId={maskId} />
                    {normalLetters}
                </>
            )}
        </Group>
    );
};

export default SVGWord;
