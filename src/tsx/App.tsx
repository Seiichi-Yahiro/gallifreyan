import { Paper } from '@mui/material';
import React from 'react';
import './App.scss';
import SVGView from './svg/SVGView';
import Sidebar from './sidebar/Sidebar';

const App: React.FunctionComponent = () => (
    <Paper square={true} className="app">
        <Sidebar />
        <SVGView />
    </Paper>
);

export default App;
