import * as React from 'react';
import { useContext, useRef, useState } from 'react';
import Button from '../../component/Button';
import HorizontalRuler from '../../component/HorizontalRuler';
import { AppContextState, AppContextStateDispatch } from '../AppContext';
import { createClassName } from '../../utils/ComponentUtils';
import WordTree from './WordTree';
import Settings from './Settings';
import { addWordAction } from '../../store/AppStore';

const Words: React.FunctionComponent = () => {
    const dispatch = useContext(AppContextStateDispatch);
    const { selection } = useContext(AppContextState);
    const [newWord, setNewWord] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewWord(event.currentTarget.value);

    const onAddWordClick = () => {
        if (newWord === '') {
            return;
        }

        dispatch(addWordAction(newWord));
        setNewWord('');

        const input = inputRef.current;

        if (input) {
            input.focus();
        }
    };

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onAddWordClick();
        }
    };

    const hasSelection = selection !== undefined;

    const className = createClassName('grid__sidebar', 'sidebar', {
        'sidebar--with-selection': hasSelection
    });

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="text"
                className="sidebar__new-word-input text-input"
                placeholder="Word..."
                value={newWord}
                onChange={onTextInputChange}
                onKeyPress={onKeyPress}
            />
            <Button text="Add Word" onClick={onAddWordClick} className="sidebar__new-word-button button--full-width" />
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
