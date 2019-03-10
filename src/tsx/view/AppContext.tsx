import * as React from 'react';
import { AppAction, defaultAppState, IAppState } from '../store/AppStore';

export const AppContextState = React.createContext<IAppState>(defaultAppState);
AppContextState.displayName = 'AppContextState';

export const AppContextStateDispatch = React.createContext<React.Dispatch<AppAction>>(() => {}); // tslint:disable-line
AppContextStateDispatch.displayName = 'AppContextStateDispatch';
