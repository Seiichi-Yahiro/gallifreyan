import * as React from 'react';
import Button from '../../component/Button';
import HorizontalRuler from '../../component/HorizontalRuler';
import Flex from '../../component/Flex';
import { IWord } from '../svg/Word';
import { createRef } from 'react';
import Word from './Word';
import { UpdateSVGItems } from '../../App';

interface IWordsProps {
    words: IWord[];
    addWord: (text: string) => void;
    updateSVGItems: UpdateSVGItems;
    removeWord: (id: string) => void;
}

interface IWordsState {
    newWord: string;
}

class Words extends React.Component<IWordsProps, IWordsState> {
    private inputRef = createRef<HTMLInputElement>();

    constructor(props: IWordsProps) {
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
            getWordKey,
            renderWord,
            onKeyPress
        } = this;
        const { words } = this.props;
        const { newWord } = this.state;

        return (
            <div className="grid__sidebar words">
                <Flex isHorizontal={true}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="text-input"
                        placeholder="Word..."
                        value={newWord}
                        onChange={onTextInputChange}
                        onKeyPress={onKeyPress}
                    />
                    <Button
                        text="Add Word"
                        onClick={onAddWordClick}
                        className="button--full-width"
                    />
                </Flex>
                <HorizontalRuler />
                <Flex
                    items={words}
                    generateKey={getWordKey}
                    renderItem={renderWord}
                />
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

    private getWordKey = (word: IWord) => word.id;

    private renderWord = (word: IWord) => (
        <Word
            word={word}
            updateSVGItems={this.props.updateSVGItems}
            onWordRemove={this.props.removeWord}
        />
    );
}

export default Words;
