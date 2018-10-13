import * as React from 'react';
import SVG from './view/svg/SVG';
import {v4} from 'uuid';
import Words from './view/sidebar/Words';
import {IWord} from './view/svg/SVGWord';

interface IAppState {
    words: IWord[];
}

class App extends React.Component<{}, IAppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            words: []
        };
    }

    public render() {
        const {addWord, updateWord, removeWord} = this;
        const {words} = this.state;

        return (
            <div className="grid">
                <Words words={words} addWord={addWord} updateWord={updateWord} removeWord={removeWord}/>
                <SVG words={words}/>
            </div>
        );
    }

    private addWord = (text: string) => {
        const newWord: IWord = {
            id: v4(),
            text
        };

        this.setState((prevState: IAppState) => ({words: [...prevState.words, newWord]}));
    };

    private updateWord = (updatedWord: IWord) => this.setState((prevState: IAppState) => ({
        words: prevState.words.map((word: IWord) => word.id === updatedWord.id ? updatedWord : word)
    }));

    private removeWord = (id: string) => this.setState((prevState: IAppState) => ({
        words: prevState.words.filter((word: IWord) => word.id !== id)
    }));
}

export default App;