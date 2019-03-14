import { IWord } from '../types/SVG';

export enum AppActionType {
    ADD_WORD,
    UPDATE_SVG_ITEM,
    REMOVE_SVG_ITEM,
    SELECT_SVG_ITEM
}

export interface IAppAction<T> {
    type: AppActionType;
    payload: T;
}

export type Path = string[];

export interface IAppState {
    words: IWord[];
    selectedPath: Path;
}

export type AppAction = IAppAction<any> | ((state: IAppState) => IAppAction<any>);
