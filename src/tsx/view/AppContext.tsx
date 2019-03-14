import * as React from 'react';
import { appReducer, defaultAppState } from '../store/AppStore';
import { useReducer } from 'react';
import { IWord } from '../types/SVG';
import { AppAction, Path } from '../store/AppStoreTypes';

export const AppContextStateDispatch = React.createContext<React.Dispatch<AppAction>>(() => {}); // tslint:disable-line
export const AppContextStateSelection = React.createContext<Path>([]);
export const AppContextStateWords = React.createContext<IWord[]>([]);

const AppContextProvider: React.FunctionComponent = ({ children }) => {
    const [{ selectedPath, words }, dispatch] = useReducer(appReducer, defaultAppState);
    return (
        <AppContextStateDispatch.Provider value={dispatch}>
            <AppContextStateSelection.Provider value={selectedPath}>
                <AppContextStateWords.Provider value={words}>{children}</AppContextStateWords.Provider>
            </AppContextStateSelection.Provider>
        </AppContextStateDispatch.Provider>
    );
};

export default AppContextProvider;
