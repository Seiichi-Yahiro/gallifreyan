import * as React from 'react';
import Button from '../../component/Button';
import HorizontalRuler from '../../component/HorizontalRuler';
import Flex from '../../component/Flex';
import { IWord } from '../svg/SVGWord';
import { createRef } from 'react';
import Word from './Word';

interface IWordsProps {
    words: IWord[];
    addWord: (text: string) => void;
    updateWord: (
        wordId: string
    ) => (updateState: (prevWord: IWord) => IWord) => void;
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
            renderWord
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
        this.setState(() => ({ newWord }));
    };

    private onAddWordClick = () => {
        const newWord = this.state.newWord;

        if (newWord === '') {
            return;
        }

        this.props.addWord(newWord);
        this.setState(() => ({ newWord: '' }));

        const input = this.inputRef.current;

        if (input) {
            input.focus();
        }
    };

    private getWordKey = (word: IWord) => word.id;

    private renderWord = (word: IWord) => (
        <Word
            word={word}
            onWordChange={this.props.updateWord(word.id)}
            onWordRemove={this.props.removeWord}
        />
    );
}

export default Words;
