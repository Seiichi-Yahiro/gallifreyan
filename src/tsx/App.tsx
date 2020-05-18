import React from 'react';
import './App.scss';
import SVGView from './svg/SVGView';
import Sidebar from './Sidebar';

const App: React.FunctionComponent = () => {
    return (
        <div className="app">
            <Sidebar />
            <SVGView />
        </div>
    );
};

export default App;
