import * as React from 'react';
import WordTreeItem from './WordTreeItem';
import { IWord } from '../../types/SVG';

interface IWordTreeProps {
    words: IWord[];
}

const WordTree: React.FunctionComponent<IWordTreeProps> = ({ words }) => (
    <div className="sidebar__word-tree sidebar-word-tree">
        {words.map(word => (
            <WordTreeItem svgItem={word} key={word.id} />
        ))}
    </div>
);

export default React.memo(WordTree);
