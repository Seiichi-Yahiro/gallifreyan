import * as React from 'react';
import SVG from './view/svg/SVG';
import Sidebar from './view/sidebar/Sidebar';
import AppContextProvider from './view/AppContext';

const App: React.FunctionComponent = () => (
    <div className="grid">
        <AppContextProvider>
            <Sidebar />
            <SVG />
        </AppContextProvider>
    </div>
);

export default App;
