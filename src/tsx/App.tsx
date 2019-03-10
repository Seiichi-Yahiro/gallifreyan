import * as React from 'react';
import { useReducer } from 'react';
import SVG from './view/svg/SVG';
import Sidebar from './view/sidebar/Sidebar';
import { AppContextState, AppContextStateDispatch } from './view/AppContext';
import { appReducer, defaultAppState } from './store/AppStore';

const App: React.FunctionComponent = () => {
    const [state, dispatch] = useReducer(appReducer, defaultAppState);
    return (
        <div className="grid">
            <AppContextStateDispatch.Provider value={dispatch}>
                <AppContextState.Provider value={state}>
                    <Sidebar />
                    <SVG />
                </AppContextState.Provider>
            </AppContextStateDispatch.Provider>
        </div>
    );
};

export default App;
