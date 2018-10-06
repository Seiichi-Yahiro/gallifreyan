import * as React from 'react';
import Button from '../component/Button';
import HorizontalRuler from '../component/HorizontalRuler';
import List from '../component/List';

interface IWordsState {
    words: string[];
}

class Words extends React.Component<{}, IWordsState> {

    constructor (props: {}) {
        super(props);

        this.state = {
            words: []
        };
    }

    public render() {
        const {addWord} = this;
        const {words} = this.state;

        return (
            <div className="grid__sidebar words">
                <List isHorizontal={true}>
                    <input type="text" className="text-input" placeholder="Word..."/>
                    <Button text="Add Word" onClick={addWord} className="button--full-width" />
                </List>
                <HorizontalRuler/>
                <List items={words}/>
            </div>
        );
    }

    private addWord = () => {
        console.log('Add Word');
    }
}

export default Words;