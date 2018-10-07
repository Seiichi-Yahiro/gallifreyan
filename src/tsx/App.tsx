import * as React from 'react';
import SVG from './view/SVG';
import Words from './view/Words';
import {v4} from 'uuid';

export interface IWord {
    readonly id: string;
    text: string;
}

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
        const {addWord} = this;
        const {words} = this.state;

        return (
            <div className="grid">
                <Words words={words} addWord={addWord}/>
                <SVG/>
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
}

export default App;