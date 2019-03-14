import * as React from 'react';
import { ISVGBaseItem, IWord, SVGItemType } from '../types/SVG';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import { getPath, getSVGItem, removeSVGItem, updateSVGItem } from './StateUtils';
import { calculateAngles } from '../utils/WordUtils';
import { AppAction, AppActionType, IAppAction, IAppState, Path } from './AppStoreTypes';

export const defaultAppState: IAppState = {
    words: [],
    selectedPath: []
};

export const appReducer: React.Reducer<IAppState, AppAction> = (state, getAction): IAppState => {
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

        case AppActionType.UPDATE_SVG_ITEM: {
            return { ...state, words: action.payload };
        }

        case AppActionType.REMOVE_SVG_ITEM: {
            return { ...action.payload };
        }

        case AppActionType.SELECT_SVG_ITEM: {
            return { ...state, selectedPath: action.payload };
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
    words: prevWords
}: IAppState): IAppAction<IWord[]> => {
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

    return {
        type: AppActionType.UPDATE_SVG_ITEM,
        payload: newWords
    };
};

export const removeSVGItemsAction = (svgItem: ISVGBaseItem) => ({
    words: prevWords,
    selectedPath: prevSelectedPath
}: IAppState): IAppAction<IAppState> => {
    const pathOfToDelete = getPath(svgItem);
    const newWords = removeSVGItem(pathOfToDelete, prevWords) as IWord[];
    const newSelection = prevSelectedPath.some(id => id === svgItem.id) ? [] : prevSelectedPath;

    return {
        type: AppActionType.REMOVE_SVG_ITEM,
        payload: {
            words: newWords,
            selectedPath: newSelection
        }
    };
};

export const selectAction = (svgItem?: ISVGBaseItem): IAppAction<Path> => ({
    type: AppActionType.SELECT_SVG_ITEM,
    payload: svgItem ? getPath(svgItem) : []
});
