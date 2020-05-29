import React from 'react';
import './App.scss';
import SVGView from './svg/SVGView';
import Sidebar from './sidebar/Sidebar';

const App: React.FunctionComponent = () => (
    <div className="app">
        <Sidebar />
        <SVGView />
    </div>
);

export default App;
