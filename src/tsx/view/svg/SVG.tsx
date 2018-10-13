import * as React from 'react';
import SVGWord, {IWord} from './SVGWord';

interface ISVGProps {
    words: IWord[];
}

const SVG: React.SFC<ISVGProps> = ({words}) => (
    <svg className="grid__svg" viewBox="0 0 1000 1000">
        <g style={{transform: 'translate(50%, 50%)'}}>
            {words.map((word: IWord) => (<SVGWord key={word.id} word={word}/>))}
        </g>
    </svg>
);

export default SVG;