import * as React from 'react';
import SVG, { SVGItem } from './view/svg/SVG';
import { v4 } from 'uuid';
import Words from './view/sidebar/Words';
import { IWord } from './view/svg/Word';
import {
    calculateCircleIntersectionAngle,
    calculateCircleIntersectionPoints,
    getSVGItem,
    updateSVGItem
} from './view/svg/utils/Utils';
import { ILetter } from './view/svg/Letter';
import { isFullCircle } from './view/svg/utils/LetterGroups';
import Point from './view/svg/utils/Point';
import * as _ from 'lodash';

export type UpdateSVGItems = <T extends SVGItem>(
    path: string[],
    update: (prevItem: T, prevState: IAppState) => T
) => void;

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

    public updateSVGItems: UpdateSVGItems = <T extends SVGItem>(
        path: string[],
        update: (prevItem: T, prevState: IAppState) => T
    ) =>
        this.setState(prevState => {
            const prevItem = getSVGItem(path, prevState.children) as T;
            const updatedItem = update(prevItem, prevState);

            return {
                children: updateSVGItem(
                    path,
                    updatedItem,
                    prevState.children
                ) as IWord[]
            };
        });

    public removeWord = (wordId: string) =>
        this.setState((prevState: IAppState) => ({
            children: prevState.children.filter(
                (word: IWord) => word.id !== wordId
            )
        }));

    public select = (path: string[]) => this.setState({ selection: path });

    public calculateAngles = (wordId: string) => () =>
        this.setState(prevState => ({
            children: prevState.children.map(word => {
                if (word.id === wordId) {
                    const wordRadius = word.r;
                    const wordAngles = _.chain(word.children)
                        .filter(({ text }) => !isFullCircle(text))
                        .flatMap(({ x, y, r }) => {
                            const letterPosition = new Point(x, y);

                            const angles = calculateCircleIntersectionPoints(
                                wordRadius,
                                r,
                                letterPosition
                            )
                                .map(point =>
                                    calculateCircleIntersectionAngle(
                                        point,
                                        wordRadius
                                    )
                                )
                                .sort();

                            // if letter circle is not on top the word 0° point
                            if (
                                new Point(wordRadius, 0)
                                    .subtract(letterPosition)
                                    .length() > r
                            ) {
                                return angles.reverse();
                            }

                            return angles;
                        })
                        .value();

                    const children = word.children.map(letter => {
                        const { x, y, r } = letter;
                        const letterPosition = new Point(x, y);
                        let angles = calculateCircleIntersectionPoints(
                            wordRadius,
                            r,
                            letterPosition
                        )
                            .map(point => point.subtract(letterPosition))
                            .map(point =>
                                calculateCircleIntersectionAngle(point, r)
                            )
                            .sort();

                        // if letter 0° point is not inside word circle
                        if (
                            letterPosition.add(new Point(r, 0)).length() >
                            wordRadius
                        ) {
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
