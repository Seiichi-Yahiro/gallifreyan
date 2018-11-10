import * as React from 'react';
import SVG from './view/svg/SVG';
import { v4 } from 'uuid';
import Words from './view/sidebar/Words';
import { IWord } from './view/svg/Word';
import { ILetter } from './view/svg/Letter';
import {
    calculateCircleIntersectionAngle,
    calculateCircleIntersectionPoints,
    Point
} from './view/svg/Utils';

interface IAppState {
    words: IWord[];
    selection: string[];
}

class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            words: [],
            selection: []
        };
    }

    public render() {
        const {
            addWord,
            updateWord,
            removeWord,
            select,
            updateLetters,
            calculateAngles
        } = this;
        const { words, selection } = this.state;

        return (
            <div className="grid">
                <Words
                    words={words}
                    addWord={addWord}
                    updateWord={updateWord}
                    removeWord={removeWord}
                />
                <SVG
                    words={words}
                    selection={selection}
                    addWord={addWord}
                    updateWord={updateWord}
                    removeWord={removeWord}
                    select={select}
                    updateLetters={updateLetters}
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
            letters: [],
            angles: []
        };

        this.setState((prevState: IAppState) => ({
            words: [...prevState.words, newWord]
        }));
    };

    public updateWord = (wordId: string) => (
        updateState: (prevWord: IWord) => IWord
    ) =>
        this.setState((prevState: IAppState) => {
            const foundWord = prevState.words.filter(
                word => word.id === wordId
            );
            if (foundWord.length !== 0) {
                const prevWord = foundWord[0];
                const updatedWord = updateState(prevWord);
                return {
                    words: prevState.words.map(word =>
                        word.id === updatedWord.id ? updatedWord : word
                    )
                };
            }
            return { words: prevState.words };
        });

    public removeWord = (wordId: string) =>
        this.setState((prevState: IAppState) => ({
            words: prevState.words.filter((word: IWord) => word.id !== wordId)
        }));

    public select = (path: string[]) =>
        this.setState(() => ({ selection: path }));

    public updateLetters = (wordId: string) => (
        updateState: (prevLetters: ILetter[]) => ILetter[]
    ) =>
        this.setState(prevState => ({
            words: prevState.words.map(word => {
                if (word.id === wordId) {
                    return {
                        ...word,
                        letters: updateState(word.letters)
                    };
                }

                return word;
            })
        }));

    public calculateAngles = (wordId: string) => () =>
        this.setState(prevState => ({
            words: prevState.words.map(word => {
                if (word.id === wordId) {
                    const wordRadius = word.r;
                    const wordAngles: number[] = [];

                    const letters = word.letters.map(letter => {
                        const letterPoint = new Point(letter.x, letter.y);
                        const letterRadius = letter.r;
                        const intersections = calculateCircleIntersectionPoints(
                            wordRadius,
                            letterRadius,
                            letterPoint
                        );

                        if (intersections.length !== 0) {
                            let anglesOfWord = intersections
                                .map(p =>
                                    calculateCircleIntersectionAngle(
                                        p,
                                        wordRadius
                                    )
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
                        }

                        return letter;
                    });

                    return {
                        ...word,
                        letters,
                        angles: wordAngles
                    };
                }
                return word;
            })
        }));
}

export default App;
