import * as React from 'react';
import WordTreeItem from './WordTreeItem';
import AppContext from '../AppContext';

class WordTree extends React.Component {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    public render() {
        const { words } = this.context;

        return (
            <div className="sidebar__word-tree sidebar-word-tree">
                {words.map(word => (
                    <WordTreeItem svgItem={word} key={word.id} />
                ))}
            </div>
        );
    }
}

export default WordTree;
