import * as React from 'react';
import { useContext } from 'react';
import HorizontalRuler from '../../component/HorizontalRuler';
import { AppContextState } from '../AppContext';
import { createClassName } from '../../utils/ComponentUtils';
import WordTree from './WordTree';
import Settings from './Settings';
import NewWord from './NewWord';

const Words: React.FunctionComponent = () => {
    const { selection } = useContext(AppContextState);
    const hasSelection = selection !== undefined;

    const className = createClassName('grid__sidebar', 'sidebar', {
        'sidebar--with-selection': hasSelection
    });

    return (
        <div className={className}>
            <NewWord />
            <HorizontalRuler className="sidebar__splitter" />
            <WordTree />
            {hasSelection && (
                <>
                    <HorizontalRuler className="sidebar__splitter" />
                    <Settings />
                </>
            )}
        </div>
    );
};

export default Words;
