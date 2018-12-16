import * as React from 'react';
import Group from './Group';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableData } from 'react-draggable';
import { ISVGContext } from './SVGContext';
import Letter, { ILetter } from './Letter';
import { partialCircle } from './utils/Utils';
import { v4 } from 'uuid';
import { ISVGCircleItem } from './SVG';
import { UpdateSVGItems } from '../../App';
import Draggable from '../../component/Draggable';
import Point from './utils/Point';
import {
    DOUBLE_LETTER,
    isDeepCut,
    isEmpty,
    isInside,
    isOnLine,
    isShallowCut,
    isValidLetter,
    isVocal,
    letterGroupsCombination
} from './utils/LetterGroups';
import * as _ from 'lodash';

export interface IWord extends ISVGCircleItem {
    text: string;
    children: ILetter[];
    angles: number[];
}

interface IWordProps {
    word: IWord;
    selection: string[];
    select: (path: string[]) => void;
    updateSVGItems: UpdateSVGItems;
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
            onClick,
            calculateWordAnglePairs,
            onDrag,
            toggleDragging,
            toggleHover
        } = this;
        const {
            selection,
            select,
            word,
            updateSVGItems,
            calculateAngles
        } = this.props;
        const isSelected = selection.length === 1 && word.id === selection[0];
        const { id, x, y, r, isHovered, isDragging, children: letters } = word;
        const wordAngles = calculateWordAnglePairs();

        const groupClassNames = createClassName('svg-word', {
            'svg-word--is-selected': isSelected,
            'svg-word--is-hovered': isHovered,
            'svg-word--is-dragging': isDragging
        });

        return (
            <Draggable
                isSelected={isSelected}
                onDragStart={toggleDragging(true)}
                onDragStop={toggleDragging(false)}
                onDrag={onDrag}
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
                        onMouseEnter={toggleHover(true)}
                        onMouseLeave={toggleHover(false)}
                        onClick={onClick}
                    />

                    {letters.map((letter: ILetter) => (
                        <Letter
                            parent={id}
                            letter={letter}
                            updateSVGItems={updateSVGItems}
                            calculateAngles={calculateAngles}
                            key={letter.id}
                            selection={selection}
                            select={select}
                        />
                    ))}
                </Group>
            </Draggable>
        );
    }

    private initializeLetters = () => {
        const { word, calculateAngles, updateSVGItems } = this.props;
        const { text, id, r } = word;

        const initialize = _.flow(
            this.splitWordToLetters,
            this.filterValidLetters,
            _.partial(this.initializeLettersPosition, _, r),
            this.initializeLettersRotation
        );

        updateSVGItems<IWord>([id], prevItem => ({
            ...prevItem,
            children: initialize(text)
        }));

        calculateAngles();
    };

    private initializeLettersRotation = (letters: ILetter[]): ILetter[] => {
        const newLetters = [...letters];
        const radians =
            -(Math.PI * 2) /
            newLetters
                .map(l => l.text)
                .map(isVocal)
                .filter(
                    (vocal, index, array) =>
                        !(index !== 0 && vocal && !array[index - 1])
                ).length;

        let rotationIndex = 0;

        for (let i = 0; i < newLetters.length; i++) {
            const { text: letter, x, y } = newLetters[i];
            const previousLetter = i !== 0 ? newLetters[i - 1].text : '';

            if (
                isVocal(letter) &&
                !letterGroupsCombination(isVocal, isEmpty)(previousLetter)
            ) {
                rotationIndex = rotationIndex > 0 ? rotationIndex - 1 : 0;
            }

            newLetters[i] = {
                ...newLetters[i],
                ...new Point(x, y).rotate(radians * rotationIndex)
            };

            rotationIndex++;
        }

        return newLetters;
    };

    private initializeLettersPosition = (
        letters: string[],
        wordRadius: number
    ): ILetter[] =>
        letters.map((letter: string, index: number) => {
            const previousLetter = index !== 0 ? letters[index - 1] : '';
            const initialPoint = this.initializeLetterPosition(
                letter,
                previousLetter,
                wordRadius
            );

            return {
                ...initialPoint,
                id: v4(),
                r: isVocal(letter) ? 10 : 25,
                text: letter,
                angles: [],
                isHovered: false,
                isDragging: false,
                children: []
            } as ILetter;
        });

    private initializeLetterPosition = (
        letter: string,
        previousLetter: string,
        wordRadius: number
    ): Point => {
        switch (true) {
            case isVocal(letter): {
                return this.initializeVocalPosition(
                    letter,
                    previousLetter,
                    wordRadius
                );
            }

            case isDeepCut(letter): {
                return new Point(0, wordRadius - 25 * 0.75);
            }

            case isInside(letter): {
                return new Point(0, wordRadius - 25 - 5);
            }

            case isShallowCut(letter):
            case isOnLine(letter):
            default: {
                return new Point(0, wordRadius);
            }
        }
    };

    private initializeVocalPosition = (
        vocal: string,
        previousLetter: string,
        wordRadius: number
    ): Point => {
        switch (true) {
            case RegExp('a', 'i').test(vocal): {
                return new Point(0, wordRadius + 10 + 5); // TODO is on line ?
            }

            case RegExp('o', 'i').test(vocal): {
                if (letterGroupsCombination(isEmpty, isVocal)(previousLetter)) {
                    return new Point(0, wordRadius - 10 - 5);
                } else {
                    const previousLetterPosition = this.initializeLetterPosition(
                        previousLetter,
                        '',
                        wordRadius
                    );
                    return previousLetterPosition.subtract(new Point(0, 25));
                }
            }

            case RegExp(/[eiu]/, 'i').test(vocal):
            default: {
                if (letterGroupsCombination(isEmpty, isVocal)(previousLetter)) {
                    return new Point(0, wordRadius);
                } else {
                    return this.initializeLetterPosition(
                        previousLetter,
                        '',
                        wordRadius
                    );
                }
            }
        }
    };

    private calculateWordAnglePairs = () => {
        const wordAngles = this.props.word.angles;
        if (wordAngles.length >= 2) {
            wordAngles.push(wordAngles.shift()!);
            return _.chain(wordAngles)
                .chunk(2)
                .map(([start, end]) => [
                    start < end ? start + 2 * Math.PI : start,
                    end
                ])
                .value();
        }
        return [];
    };

    private splitWordToLetters = (word: string): string[] => {
        const index = word.search(DOUBLE_LETTER);

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

    private filterValidLetters = (letters: string[]) =>
        letters.filter(isValidLetter);

    private toggleDragging = (isDragging: boolean) => () =>
        this.props.updateSVGItems<IWord>([this.props.word.id], prevItem => ({
            ...prevItem,
            isDragging
        }));

    private onDrag = (svgContext: ISVGContext) => (
        event: MouseEvent,
        data: DraggableData
    ) => {
        const { word, updateSVGItems } = this.props;
        const { x, y, id } = word;
        const { deltaX, deltaY } = data;
        const { zoomX, zoomY } = svgContext;

        updateSVGItems<IWord>([id], prevItem => ({
            ...prevItem,
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
    };

    private toggleHover = (isHovered: boolean) => () =>
        this.props.updateSVGItems<IWord>([this.props.word.id], prevItem => ({
            ...prevItem,
            isHovered
        }));

    private onClick = () => this.props.select([this.props.word.id]);
}

export default Word;
