import React from 'react';
import { useRedux } from '../state/AppStore';
import { Sentence } from '../state/StateTypes';
import Group from './Group';
import { SVGCircle } from './SVGCircle';
import SVGWord from './SVGWord';

interface SentenceProps extends Sentence {}

const SVGSentence: React.FunctionComponent<SentenceProps> = ({ circleId, words }) => {
    const sentenceCircle = useRedux((state) => state.circles[circleId]);

    return (
        <Group x={sentenceCircle.x} y={sentenceCircle.y}>
            <SVGCircle r={sentenceCircle.r} filled={sentenceCircle.filled} />
            {words.map((word) => (
                <SVGWord key={word.circleId} {...word} />
            ))}
        </Group>
    );
};

export default SVGSentence;
