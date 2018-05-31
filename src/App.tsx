import * as React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Canvas from './components/Canvas';
import TextField from './components/TextField';


interface IAppState {
    text: string;
}

class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            text: ''
        };
    }

    public render() {
        return (
            <div>
                <TextField onChange={this.changeText}/>
                <Canvas text={this.state.text}/>
            </div>
        );
    }

    private changeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({text: event.target.value});
    }
}

export default DragDropContext(HTML5Backend)(App);