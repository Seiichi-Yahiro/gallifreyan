import * as React from 'react';
import { useContext, useMemo } from 'react';
import HorizontalRuler from '../../component/HorizontalRuler';
import { AppContextStateSelection, AppContextStateWords } from '../AppContext';
import { createClassName } from '../../utils/ComponentUtils';
import WordTree from './WordTree';
import Settings from './Settings';
import NewWord from './NewWord';
import { getSVGItem } from '../../store/StateUtils';

const Sidebar: React.FunctionComponent = () => {
    const selection = useContext(AppContextStateSelection);
    const words = useContext(AppContextStateWords);
    const hasSelection = selection.length !== 0;

    const className = useMemo(
        () =>
            createClassName('grid__sidebar', 'sidebar', {
                'sidebar--with-selection': hasSelection
            }),
        [hasSelection]
    );

    return (
        <div className={className}>
            <NewWord />
            <HorizontalRuler className="sidebar__splitter" />
            <WordTree words={words} />
            {hasSelection && (
                <>
                    <HorizontalRuler className="sidebar__splitter" />
                    <Settings selectedItem={getSVGItem(selection, words)} />
                </>
            )}
        </div>
    );
};

export default Sidebar;
