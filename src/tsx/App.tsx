import * as React from 'react';
import SVG, { SVGItem } from './view/svg/SVG';
import { v4 } from 'uuid';
import Words from './view/sidebar/Words';
import { IWord } from './view/svg/Word';
import {
    calculateCircleIntersectionAngle,
    calculateCircleIntersectionPoints,
    getSVGItem,
    Point,
    updateSVGItem
} from './view/svg/Utils';

export interface IAppState {
    children: IWord[];
    selection: string[];
}

class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            children: [],
            selection: []
        };
    }

    public render() {
        const {
            addWord,
            removeWord,
            select,
            calculateAngles,
            updateSVGItems
        } = this;
        const { children: words, selection } = this.state;

        return (
            <div className="grid">
                <Words
                    words={words}
                    addWord={addWord}
                    updateSVGItems={updateSVGItems}
                    removeWord={removeWord}
                />
                <SVG
                    words={words}
                    selection={selection}
                    updateSVGItems={updateSVGItems}
                    addWord={addWord}
                    removeWord={removeWord}
                    select={select}
                    calculateAngles={calculateAngles}
                />
            </div>
        );
    }

    public addWord = (text: string) => {
        const newWord: IWord = {
            id: v4(),
            text,
            x: 0,
            y: 0,
            r: 50,
            isHovered: false,
            isDragging: false,
            children: [],
            angles: []
        };

        this.setState((prevState: IAppState) => ({
            children: [...prevState.children, newWord]
        }));
    };

    public updateSVGItems = (
        path: string[],
        update: (prevItem: SVGItem, prevState: IAppState) => SVGItem
    ) =>
        this.setState(prevState => {
            const prevItem = getSVGItem(path, prevState.children);
            const updatedItem = update(prevItem, prevState);

            return {
                children: updateSVGItem(path, updatedItem, prevState.children)
            };
        });

    public removeWord = (wordId: string) =>
        this.setState((prevState: IAppState) => ({
            children: prevState.children.filter(
                (word: IWord) => word.id !== wordId
            )
        }));

    public select = (path: string[]) =>
        this.setState(() => ({ selection: path }));

    public calculateAngles = (wordId: string) => () =>
        this.setState(prevState => ({
            children: prevState.children.map(word => {
                if (word.id === wordId) {
                    const wordRadius = word.r;
                    const wordAngles: number[] = [];

                    const letters = word.children.map(letter => {
                        const letterPoint = new Point(letter.x, letter.y);
                        const letterRadius = letter.r;
                        const intersections = calculateCircleIntersectionPoints(
                            wordRadius,
                            letterRadius,
                            letterPoint
                        );

                        let anglesOfWord = intersections
                            .map(p =>
                                calculateCircleIntersectionAngle(p, wordRadius)
                            )
                            .sort();

                        // if letter circle is not on top the word 0° point
                        if (
                            new Point(wordRadius, 0)
                                .subtract(letterPoint)
                                .length() > letterRadius
                        ) {
                            anglesOfWord = anglesOfWord.reverse();
                        }

                        wordAngles.push(...anglesOfWord);

                        let anglesOfLetter = intersections
                            .map(p => p.subtract(letterPoint))
                            .map(p =>
                                calculateCircleIntersectionAngle(
                                    p,
                                    letterRadius
                                )
                            )
                            .sort();

                        // if letter circle is not on top the word 180° point
                        if (
                            letterPoint
                                .add(new Point(letterRadius, 0))
                                .length() > wordRadius
                        ) {
                            anglesOfLetter = anglesOfLetter.reverse();
                        }

                        return {
                            ...letter,
                            angles: anglesOfLetter
                        };
                    });

                    return {
                        ...word,
                        children: letters,
                        angles: wordAngles
                    };
                }
                return word;
            })
        }));
}

export default App;
