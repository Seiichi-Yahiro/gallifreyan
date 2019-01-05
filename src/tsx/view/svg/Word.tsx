import * as React from 'react';
import Group from './Group';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableData } from 'react-draggable';
import Letter from './Letter';
import { partialCircle } from './utils/Utils';
import { v4 } from 'uuid';
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
import { ILetter, IWord } from '../../types/SVG';
import AppContext from '../AppContext';

interface IWordProps {
    word: IWord;
}

class Word extends React.Component<IWordProps> {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    public componentDidMount() {
        this.initializeLetters();
    }

    public componentDidUpdate(prevProps: IWordProps) {
        if (prevProps.word.text !== this.props.word.text) {
            this.initializeLetters();
        }
    }

    public render() {
        const { onClick, calculateWordAnglePairs, onDrag, toggleDragging, toggleHover } = this;
        const { word } = this.props;
        const { selection } = this.context;
        const isSelected = selection === word;
        const { x, y, r, isHovered, isDragging, children: letters } = word;
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
                            <path d={partialCircle(0, 0, r, start, end)} key={index} />
                        ))
                    )}

                    <circle
                        r={r}
                        className="svg-word__selection-area"
                        onMouseEnter={toggleHover(true)}
                        onMouseLeave={toggleHover(false)}
                        onClick={onClick}
                    />

                    {letters.map(letter => (
                        <Letter letter={letter} key={letter.id} />
                    ))}
                </Group>
            </Draggable>
        );
    }

    private initializeLetters = () => {
        const { word } = this.props;
        const { calculateAngles, updateSVGItems } = this.context;
        const { text, r } = word;

        const initialize = _.flow(
            this.splitWordToLetters,
            this.filterValidLetters,
            _.partial(this.initializeLettersPosition, _, r),
            this.initializeLettersRotation
        );

        updateSVGItems(word, () => ({
            children: initialize(text)
        }));

        calculateAngles(word.id);
    };

    private initializeLettersRotation = (letters: ILetter[]): ILetter[] => {
        const newLetters = [...letters];
        const radians =
            -(Math.PI * 2) /
            newLetters
                .map(l => l.text)
                .map(isVocal)
                .filter((vocal, index, array) => !(index !== 0 && vocal && !array[index - 1])).length;

        let rotationIndex = 0;

        for (let i = 0; i < newLetters.length; i++) {
            const { text: letter, x, y } = newLetters[i];
            const previousLetter = i !== 0 ? newLetters[i - 1].text : '';

            if (isVocal(letter) && !letterGroupsCombination(isVocal, isEmpty)(previousLetter)) {
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

    private initializeLettersPosition = (letters: string[], wordRadius: number): ILetter[] =>
        letters.map((letter: string, index: number) => {
            const previousLetter = index !== 0 ? letters[index - 1] : '';
            const initialPoint = this.initializeLetterPosition(letter, previousLetter, wordRadius);

            return {
                ...initialPoint,
                id: v4(),
                parent: this.props.word,
                r: isVocal(letter) ? 10 : 25,
                text: letter,
                angles: [],
                isHovered: false,
                isDragging: false,
                children: []
            } as ILetter;
        });

    private initializeLetterPosition = (letter: string, previousLetter: string, wordRadius: number): Point => {
        switch (true) {
            case isVocal(letter): {
                return this.initializeVocalPosition(letter, previousLetter, wordRadius);
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

    private initializeVocalPosition = (vocal: string, previousLetter: string, wordRadius: number): Point => {
        switch (true) {
            case RegExp('a', 'i').test(vocal): {
                return new Point(0, wordRadius + 10 + 5); // TODO is on line ?
            }

            case RegExp('o', 'i').test(vocal): {
                if (letterGroupsCombination(isEmpty, isVocal)(previousLetter)) {
                    return new Point(0, wordRadius - 10 - 5);
                } else {
                    const previousLetterPosition = this.initializeLetterPosition(previousLetter, '', wordRadius);
                    return previousLetterPosition.subtract(new Point(0, 25));
                }
            }

            case RegExp(/[eiu]/, 'i').test(vocal):
            default: {
                if (letterGroupsCombination(isEmpty, isVocal)(previousLetter)) {
                    return new Point(0, wordRadius);
                } else {
                    return this.initializeLetterPosition(previousLetter, '', wordRadius);
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
                .map(([start, end]) => [start < end ? start + 2 * Math.PI : start, end])
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

    private filterValidLetters = (letters: string[]) => letters.filter(isValidLetter);

    private toggleDragging = (isDragging: boolean) => () =>
        this.context.updateSVGItems(this.props.word, () => ({
            isDragging
        }));

    private onDrag = (zoomX: number, zoomY: number) => (event: React.MouseEvent<HTMLElement>, data: DraggableData) => {
        const { word } = this.props;
        const { updateSVGItems } = this.context;
        const { x, y } = word;
        const { deltaX, deltaY } = data;

        updateSVGItems(word, () => ({
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
    };

    private toggleHover = (isHovered: boolean) => () =>
        this.context.updateSVGItems(this.props.word, () => ({
            isHovered
        }));

    private onClick = () => this.context.select(this.props.word);
}

export default Word;
