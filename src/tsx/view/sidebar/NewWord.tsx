import * as React from 'react';
import { addWordAction } from '../../store/AppStore';
import { AppContextStateDispatch } from '../AppContext';
import { useContext, useRef } from 'react';
import Button from '../../component/Button';

const NewWord: React.FunctionComponent = () => {
    const dispatch = useContext(AppContextStateDispatch);
    const inputRef = useRef<HTMLInputElement>(null);

    const onAddWordClick = () => {
        const input = inputRef.current;
        const newWord = input ? input.value : '';

        if (input && newWord !== '') {
            dispatch(addWordAction(newWord));
            input.focus();
        }
    };

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onAddWordClick();
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="text"
                className="sidebar__new-word-input text-input"
                placeholder="Word..."
                onKeyPress={onKeyPress}
            />
            <Button text="Add Word" onClick={onAddWordClick} className="sidebar__new-word-button button--full-width" />
        </>
    );
};

export default React.memo(NewWord);
