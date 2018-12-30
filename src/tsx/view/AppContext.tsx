import * as React from 'react';
import { IWord } from './svg/Word';
import { SVGItem } from './svg/SVG';

export interface IAppContextState {
    children: IWord[];
    selection: string[];
}

export const defaultAppContextState: IAppContextState = {
    children: [],
    selection: []
};

type UpdateSVGItems = <T extends SVGItem>(
    path: string[],
    update: (prevItem: T, prevState: IAppContextState) => T
) => void;

export interface IAppContextFunctions {
    addWord: (text: string) => void;
    updateSVGItems: UpdateSVGItems;
    removeWord: (id: string) => void;
    select: (path: string[]) => void;
    calculateAngles: (wordId: string) => void;
}

// tslint:disable
const defaultAppContextFunctions: IAppContextFunctions = {
    addWord: () => {},
    updateSVGItems: () => {},
    removeWord: () => {},
    select: () => {},
    calculateAngles: () => {}
};
// tslint:enable

export type IAppContext = IAppContextState & IAppContextFunctions;

const defaultAppContext: IAppContext = {
    ...defaultAppContextState,
    ...defaultAppContextFunctions
};

const AppContext = React.createContext<IAppContext>(defaultAppContext);
AppContext.displayName = 'AppContext';

export default AppContext;
