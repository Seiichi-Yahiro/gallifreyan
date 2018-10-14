import * as React from 'react';
import SVGWord, {IWord} from './SVGWord';
import Group, {Unit} from './Group';

interface ISVGProps {
    words: IWord[];
}

const SVG: React.SFC<ISVGProps> = ({words}) => (
    <svg className="grid__svg" viewBox="0 0 1000 1000">
        <Group x={50} y={50} unit={Unit.PERCENT}>
            {words.map((word: IWord) => (<SVGWord key={word.id} word={word}/>))}
        </Group>
    </svg>
);

export default SVG;