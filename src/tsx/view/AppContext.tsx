import * as React from 'react';
import { ISVGBaseItem, IWord } from '../types/SVG';

export interface IAppContextState {
    words: IWord[];
    selection: string[];
}

export const defaultAppContextState: IAppContextState = {
    words: [],
    selection: []
};

type UpdateSVGItems = <T extends ISVGBaseItem>(
    svgItem: T,
    update: (prevItem: T, prevState: IAppContextState) => Partial<T>
) => void;

export interface IAppContextFunctions {
    addWord: (text: string) => void;
    updateSVGItems: UpdateSVGItems;
    removeSVGItems: (svgItem: ISVGBaseItem) => void;
    select: (path: string[]) => void;
    calculateAngles: (wordId: string) => void;
}

// tslint:disable
const defaultAppContextFunctions: IAppContextFunctions = {
    addWord: () => {},
    updateSVGItems: () => {},
    removeSVGItems: () => {},
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
