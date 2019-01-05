import * as React from 'react';
import Button from '../../component/Button';
import HorizontalRuler from '../../component/HorizontalRuler';
import { createRef } from 'react';
import AppContext from '../AppContext';
import { createClassName } from '../../component/ComponentUtils';
import WordTree from './WordTree';
import Settings from './Settings';

interface IWordsState {
    newWord: string;
}

class Words extends React.Component<{}, IWordsState> {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    private inputRef = createRef<HTMLInputElement>();

    constructor(props: {}) {
        super(props);

        this.state = {
            newWord: ''
        };
    }

    public render() {
        const { inputRef, onTextInputChange, onAddWordClick, onKeyPress } = this;
        const { newWord } = this.state;
        const { selection } = this.context;
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
                <Button
                    text="Add Word"
                    onClick={onAddWordClick}
                    className="sidebar__new-word-button button--full-width"
                />
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
    }

    private onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newWord = event.currentTarget.value;
        this.setState({ newWord });
    };

    private onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.onAddWordClick();
        }
    };

    private onAddWordClick = () => {
        const newWord = this.state.newWord;

        if (newWord === '') {
            return;
        }

        this.context.addWord(newWord);
        this.setState({ newWord: '' });

        const input = this.inputRef.current;

        if (input) {
            input.focus();
        }
    };
}

export default Words;
