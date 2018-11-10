import * as React from 'react';
import Group from './Group';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableCore, DraggableData } from 'react-draggable';
import ConditionalWrapper from '../../component/ConditionalWrapper';
import SVGContext, { ISVGContext } from './SVGContext';
import Letter, { ILetter, LetterGroups } from './Letter';
import { partialCircle, Point } from './Utils';
import { v4 } from 'uuid';

export interface IWord {
    readonly id: string;
    text: string;
    x: number;
    y: number;
    r: number;
    letters: ILetter[];
    angles: number[];
    isHovered: boolean;
    isDragging: boolean;
}

interface IWordProps {
    word: IWord;
    selection: string[];
    select: (wordId: string[]) => void;
    updateWord: (updateState: (prevWord: IWord) => IWord) => void;
    updateLetters: (updateState: (prevLetters: ILetter[]) => ILetter[]) => void;
    calculateAngles: () => void;
}

class Word extends React.Component<IWordProps> {
    public componentDidMount() {
        this.initializeLetters();
    }

    public componentDidUpdate(prevProps: IWordProps) {
        if (prevProps.word.text !== this.props.word.text) {
            this.initializeLetters();
        }
    }

    public render() {
        const {
            draggableWrapper,
            onMouseEnter,
            onMouseLeave,
            onClick,
            calculateWordAnglePairs,
            onDragLetter,
            updateLetter
        } = this;
        const { selection, select, word } = this.props;
        const selectLetter = (wordId: string) => (letterId: string) =>
            select([wordId, letterId]);
        const isSelected = selection.length === 1 && word.id === selection[0];
        const { id, x, y, r, isHovered, isDragging, letters } = word;
        const wordAngles = calculateWordAnglePairs();

        const groupClassNames = createClassName('svg-word', {
            'svg-word--is-selected': isSelected,
            'svg-word--is-hovered': isHovered,
            'svg-word--is-dragging': isDragging
        });

        return (
            <ConditionalWrapper
                condition={isSelected}
                wrapper={draggableWrapper}
            >
                <Group x={x} y={y} className={groupClassNames}>
                    {wordAngles.length === 0 ? (
                        <circle r={r} />
                    ) : (
                        wordAngles.map(([start, end], index: number) => (
                            <path
                                d={partialCircle(0, 0, r, start, end)}
                                key={index}
                            />
                        ))
                    )}

                    <circle
                        r={r}
                        className="svg-word__selection-area"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={onClick}
                    />

                    {letters.map((letter: ILetter) => (
                        <Letter
                            letter={letter}
                            key={letter.id}
                            selection={selection}
                            select={selectLetter(id)}
                            onDrag={onDragLetter(letter.id)}
                            updateLetter={updateLetter(letter.id)}
                        />
                    ))}
                </Group>
            </ConditionalWrapper>
        );
    }

    private draggableWrapper = (children: React.ReactNode) => {
        const { onDragStart, onDragEnd, onDrag } = this;

        return (
            <SVGContext.Consumer>
                {(svgContext: ISVGContext) => (
                    <DraggableCore
                        enableUserSelectHack={true}
                        onStart={onDragStart}
                        onStop={onDragEnd}
                        onDrag={onDrag(svgContext)}
                    >
                        {children}
                    </DraggableCore>
                )}
            </SVGContext.Consumer>
        );
    };

    private initializeLetters = () => {
        const { word, updateLetters, calculateAngles } = this.props;
        const { r, text } = word;
        const letters = this.splitWordToLetters(text);
        const calculatedLetters = letters.map(
            (letter: string, index: number) => {
                const radians = -(Math.PI * 2) / letters.length;
                const initialPoint = new Point(0, r);
                const rotatedPoint = initialPoint.rotate(radians * index);

                return {
                    ...rotatedPoint,
                    id: v4(),
                    r: 25,
                    text: letter,
                    angles: [],
                    isHovered: false,
                    isDragging: false
                } as ILetter;
            }
        );
        updateLetters(() => calculatedLetters);
        calculateAngles();
    };

    private calculateWordAnglePairs = () => {
        const wordAngles = this.props.word.angles;
        if (wordAngles.length >= 2) {
            wordAngles.push(wordAngles.shift()!);
            return wordAngles
                .reduce((acc: number[][], angle: number, index: number) => {
                    if (acc.length === Math.floor(index / 2 + 1)) {
                        acc[Math.floor(index / 2)].push(angle);
                    } else {
                        acc.push([angle]);
                    }

                    return acc;
                }, [])
                .map(([start, end]) => [
                    start < end ? start + 2 * Math.PI : start,
                    end
                ]);
        }
        return [];
    };

    private splitWordToLetters = (word: string): string[] => {
        const index = word.search(new RegExp(LetterGroups.DOUBLE_LETTERS, 'i'));

        if (index === -1) {
            return word.split('');
        } else {
            const firstPart = word.slice(0, index);
            const found = word.slice(index, index + 2);
            const lastPart = word.slice(index + 2);

            return firstPart
                .split('')
                .concat(found)
                .concat(this.splitWordToLetters(lastPart));
        }
    };

    private updateLetter = (letterId: string) => (
        updateState: (prevLetter: ILetter) => ILetter
    ) =>
        this.props.updateLetters(prevLetters =>
            prevLetters.map(letter =>
                letter.id === letterId ? updateState(letter) : letter
            )
        );

    private onDragStart = () =>
        this.props.updateWord(prevWord => ({ ...prevWord, isDragging: true }));
    private onDragEnd = () =>
        this.props.updateWord(prevWord => ({ ...prevWord, isDragging: false }));
    private onDrag = (svgContext: ISVGContext) => (
        event: MouseEvent,
        data: DraggableData
    ) => {
        const { word, updateWord } = this.props;
        const { x, y } = word;
        const { deltaX, deltaY } = data;
        const { zoomX, zoomY } = svgContext;

        updateWord(prevWord => ({
            ...prevWord,
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
    };
    private onDragLetter = (id: string) => (x: number, y: number) => {
        this.props.updateLetters(prevLetters =>
            prevLetters.map(letter => {
                if (letter.id === id) {
                    return {
                        ...letter,
                        x,
                        y
                    };
                }
                return letter;
            })
        );
        this.props.calculateAngles();
    };

    private onMouseEnter = () =>
        this.props.updateWord(prevWord => ({ ...prevWord, isHovered: true }));
    private onMouseLeave = () =>
        this.props.updateWord(prevWord => ({ ...prevWord, isHovered: false }));
    private onClick = () => this.props.select([this.props.word.id]);
}

export default Word;
