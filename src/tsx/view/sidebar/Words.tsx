import * as React from 'react';
import Button from '../../component/Button';
import HorizontalRuler from '../../component/HorizontalRuler';
import { createRef } from 'react';
import Word from './Word';
import withContext from '../../hocs/WithContext';
import AppContext, { IAppContext } from '../AppContext';

interface IWordsState {
    newWord: string;
}

class Words extends React.Component<IAppContext, IWordsState> {
    private inputRef = createRef<HTMLInputElement>();

    constructor(props: IAppContext) {
        super(props);

        this.state = {
            newWord: ''
        };
    }

    public render() {
        const {
            inputRef,
            onTextInputChange,
            onAddWordClick,
            onKeyPress
        } = this;
        const { children: words } = this.props;
        const { newWord } = this.state;

        return (
            <div className="grid__sidebar sidebar-words">
                <input
                    ref={inputRef}
                    type="text"
                    className="sidebar-words__input text-input"
                    placeholder="Word..."
                    value={newWord}
                    onChange={onTextInputChange}
                    onKeyPress={onKeyPress}
                />
                <Button
                    text="Add Word"
                    onClick={onAddWordClick}
                    className="sidebar-words__button button--full-width"
                />
                <HorizontalRuler className="sidebar-words__splitter" />
                <div className="sidebar-words__list">
                    {words.map(word => (
                        <Word key={word.id} word={word} />
                    ))}
                </div>
            </div>
        );
    }

    private onTextInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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

        this.props.addWord(newWord);
        this.setState({ newWord: '' });

        const input = this.inputRef.current;

        if (input) {
            input.focus();
        }
    };
}

export default withContext(AppContext)(Words);
