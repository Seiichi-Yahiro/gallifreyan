import * as React from 'react';
import { useContext } from 'react';
import HorizontalRuler from '../../component/HorizontalRuler';
import { AppContextStateSelection } from '../AppContext';
import { createClassName } from '../../utils/ComponentUtils';
import WordTree from './WordTree';
import Settings from './Settings';
import NewWord from './NewWord';

const Sidebar: React.FunctionComponent = () => {
    const selection = useContext(AppContextStateSelection);
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

export default Sidebar;
