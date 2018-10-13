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
        const {addWord} = this;
        const {words} = this.state;

        return (
            <div className="grid">
                <Words words={words} addWord={addWord}/>
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
}

export default App;