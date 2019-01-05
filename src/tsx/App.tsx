import * as React from 'react';
import SVG from './view/svg/SVG';
import { v4 } from 'uuid';
import Sidebar from './view/sidebar/Sidebar';
import {
    calculateCircleIntersectionAngle,
    calculateCircleIntersectionPoints,
    getPath,
    getSVGItem,
    removeSVGItem,
    updateSVGItem
} from './view/svg/utils/Utils';
import { isFullCircle } from './view/svg/utils/LetterGroups';
import Point from './view/svg/utils/Point';
import * as _ from 'lodash';
import AppContext, { defaultAppContextState, IAppContextFunctions, IAppContextState } from './view/AppContext';
import { ILetter, ISVGBaseItem, IWord, SVGItemType } from './types/SVG';

class App extends React.Component<{}, IAppContextState> implements IAppContextFunctions {
    constructor(props: {}) {
        super(props);

        this.state = {
            ...defaultAppContextState
        };
    }

    public render() {
        const { addWord, removeSVGItems, select, calculateAngles, updateSVGItems } = this;

        return (
            <div className="grid">
                <AppContext.Provider
                    value={{
                        ...this.state,
                        addWord,
                        removeSVGItems,
                        select,
                        calculateAngles,
                        updateSVGItems
                    }}
                >
                    <Sidebar />
                    <SVG />
                </AppContext.Provider>
            </div>
        );
    }

    public addWord = (text: string) => {
        const newWord: IWord = {
            id: v4(),
            type: SVGItemType.WORD,
            text,
            x: 0,
            y: 0,
            r: 50,
            isHovered: false,
            isDragging: false,
            children: [],
            angles: []
        };

        this.setState((prevState: IAppContextState) => ({
            words: [...prevState.words, newWord]
        }));
    };

    public updateSVGItems = <T extends ISVGBaseItem>(
        svgBaseItem: T,
        update: (prevItem: T, prevState: IAppContextState) => Partial<T>
    ) =>
        this.setState(prevState => {
            const { words, selection } = prevState;
            const path = getPath(svgBaseItem);
            const prevItem = getSVGItem(path, words) as T;
            const itemUpdate = update(prevItem, prevState);
            const newSVGItem = { ...prevItem, ...itemUpdate };
            const newWords = updateSVGItem(path, newSVGItem, words) as IWord[];
            const newSelection =
                selection && path.some(id => id === selection.id)
                    ? getSVGItem(getPath(selection), newWords)
                    : selection;

            return {
                words: newWords,
                selection: newSelection
            };
        });

    public removeSVGItems = (svgItem: ISVGBaseItem) =>
        this.setState(({ words, selection }) => {
            const pathOfToDelete = getPath(svgItem);
            const pathOfSelected = selection ? getPath(selection) : [];
            const newWords = removeSVGItem(pathOfToDelete, words) as IWord[];
            const newSelection = (() => {
                if (selection) {
                    if (pathOfToDelete.some(id => id === selection.id)) {
                        // parent selected and child removed
                        return getSVGItem(pathOfSelected, newWords);
                    } else if (pathOfSelected.some(id => id === svgItem.id)) {
                        // child selected and parent removed
                        return undefined;
                    }
                }

                return selection;
            })();

            return {
                words: newWords,
                selection: newSelection
            };
        });

    public select = (svgItem?: ISVGBaseItem) => this.setState({ selection: svgItem });

    public calculateAngles = (wordId: string) =>
        this.setState(prevState => ({
            words: prevState.words.map(word => {
                if (word.id === wordId) {
                    const wordRadius = word.r;
                    const wordAngles = _.chain(word.children)
                        .filter(({ text }) => !isFullCircle(text))
                        .flatMap(({ x, y, r }) => {
                            const letterPosition = new Point(x, y);

                            const angles = calculateCircleIntersectionPoints(wordRadius, r, letterPosition)
                                .map(point => calculateCircleIntersectionAngle(point, wordRadius))
                                .sort();

                            // if letter circle is not on top the word 0° point
                            if (new Point(wordRadius, 0).subtract(letterPosition).length() > r) {
                                return angles.reverse();
                            }

                            return angles;
                        })
                        .value();

                    const children = word.children.map(letter => {
                        const { x, y, r } = letter;
                        const letterPosition = new Point(x, y);
                        let angles = calculateCircleIntersectionPoints(wordRadius, r, letterPosition)
                            .map(point => point.subtract(letterPosition))
                            .map(point => calculateCircleIntersectionAngle(point, r))
                            .sort();

                        // if letter 0° point is not inside word circle
                        if (letterPosition.add(new Point(r, 0)).length() > wordRadius) {
                            angles = angles.reverse();
                        }

                        return {
                            ...letter,
                            angles
                        } as ILetter;
                    });

                    return {
                        ...word,
                        children,
                        angles: wordAngles
                    };
                }
                return word;
            })
        }));
}

export default App;
