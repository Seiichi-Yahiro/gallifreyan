import * as React from 'react';
import { AppAction, appReducer, defaultAppState } from '../store/AppStore';
import { useReducer } from 'react';
import { ISVGBaseItem, IWord } from '../types/SVG';

export const AppContextStateDispatch = React.createContext<React.Dispatch<AppAction>>(() => {}); // tslint:disable-line
export const AppContextStateSelection = React.createContext<ISVGBaseItem | undefined>(undefined);
export const AppContextStateWords = React.createContext<IWord[]>([]);

const AppContextProvider: React.FunctionComponent = ({ children }) => {
    const [{ selection, words }, dispatch] = useReducer(appReducer, defaultAppState);
    return (
        <AppContextStateDispatch.Provider value={dispatch}>
            <AppContextStateSelection.Provider value={selection}>
                <AppContextStateWords.Provider value={words}>{children}</AppContextStateWords.Provider>
            </AppContextStateSelection.Provider>
        </AppContextStateDispatch.Provider>
    );
};

export default AppContextProvider;
