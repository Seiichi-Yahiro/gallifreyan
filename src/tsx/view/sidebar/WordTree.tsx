import * as React from 'react';
import { useContext } from 'react';
import WordTreeItem from './WordTreeItem';
import { AppContextState } from '../AppContext';

const WordTree: React.FunctionComponent = () => {
    const { words } = useContext(AppContextState);

    return (
        <div className="sidebar__word-tree sidebar-word-tree">
            {words.map(word => (
                <WordTreeItem svgItem={word} key={word.id} />
            ))}
        </div>
    );
};

export default WordTree;
