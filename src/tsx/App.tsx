import * as React from 'react';
import SVG from './view/SVG';
import Words from './view/Words';

class App extends React.Component {

    public render() {
        return (
            <div className="grid">
                <Words/>
                <SVG/>
            </div>
        );
    }
}

export default App;