import * as React from 'react';
import { ISVGBaseItem, IWord, SVGItemType } from '../types/SVG';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import { getPath, getSVGItem, removeSVGItem, updateSVGItem } from './StateUtils';
import { calculateAngles } from '../utils/WordUtils';

enum AppActionType {
    ADD_WORD,
    UPDATE_SVG_ITEM,
    REMOVE_SVG_ITEM,
    SELECT_SVG_ITEM
}

export interface IAppAction<T> {
    type: AppActionType;
    payload: T;
}

export interface IAppState {
    words: IWord[];
    selection: ISVGBaseItem | undefined;
}

export type AppAction = IAppAction<any> | ((state: IAppState) => IAppAction<any>);

export const defaultAppState: IAppState = {
    words: [],
    selection: undefined
};

export const appReducer: React.Reducer<IAppState, AppAction> = (state, getAction) => {
    let action: IAppAction<any>;

    if (typeof getAction === 'function') {
        action = getAction(state);
    } else {
        action = getAction;
    }

    switch (action.type) {
        case AppActionType.ADD_WORD: {
            return { ...state, words: [...state.words, action.payload] };
        }

        case AppActionType.UPDATE_SVG_ITEM:
        case AppActionType.REMOVE_SVG_ITEM: {
            return { ...action.payload };
        }

        case AppActionType.SELECT_SVG_ITEM: {
            return { ...state, selection: action.payload };
        }

        default:
            return state;
    }
};

export const addWordAction = (text: string): IAppAction<IWord> => {
    const newWord: IWord = {
        id: v4(),
        type: SVGItemType.WORD,
        text,
        x: 0,
        y: 0,
        r: 50,
        children: [],
        angles: []
    };

    return {
        type: AppActionType.ADD_WORD,
        payload: newWord
    };
};

export const updateSVGItemsAction = <T extends ISVGBaseItem>(svgBaseItem: T, update: (prevItem: T) => Partial<T>) => ({
    words: prevWords,
    selection: prevSelection
}: IAppState): IAppAction<IAppState> => {
    const path = getPath(svgBaseItem);
    const prevItem = getSVGItem(path, prevWords) as T;
    const itemUpdate = update(prevItem);
    const newSVGItem = { ...prevItem, ...itemUpdate };
    let newWords = updateSVGItem(path, newSVGItem, prevWords) as IWord[];

    if (svgBaseItem.type === SVGItemType.WORD || svgBaseItem.type === SVGItemType.LETTER) {
        const pathToWord = path.slice(0, 1);
        const updateAngles = _.flow(
            _.partial(getSVGItem, pathToWord),
            calculateAngles,
            _.partial(updateSVGItem, pathToWord, _, newWords)
        );

        newWords = updateAngles(newWords) as IWord[];
    }

    const newSelection =
        prevSelection && path.some(id => id === prevSelection.id)
            ? getSVGItem(getPath(prevSelection), newWords)
            : prevSelection;

    return {
        type: AppActionType.UPDATE_SVG_ITEM,
        payload: {
            words: newWords,
            selection: newSelection
        }
    };
};

export const removeSVGItemsAction = (svgItem: ISVGBaseItem) => ({
    words: prevWords,
    selection: prevSelection
}: IAppState): IAppAction<IAppState> => {
    const pathOfToDelete = getPath(svgItem);
    const pathOfSelected = prevSelection ? getPath(prevSelection) : [];

    const newWords = removeSVGItem(pathOfToDelete, prevWords) as IWord[];

    const newSelection = (() => {
        if (prevSelection) {
            if (pathOfToDelete.some(id => id === prevSelection.id)) {
                // parent selected and child removed
                return getSVGItem(pathOfSelected, newWords);
            } else if (pathOfSelected.some(id => id === svgItem.id)) {
                // child selected and parent removed
                return undefined;
            }
        }

        return prevSelection;
    })();

    return {
        type: AppActionType.REMOVE_SVG_ITEM,
        payload: {
            words: newWords,
            selection: newSelection
        }
    };
};

export const selectAction = (svgItem?: ISVGBaseItem): IAppAction<ISVGBaseItem | undefined> => ({
    type: AppActionType.SELECT_SVG_ITEM,
    payload: svgItem
});
