import * as React from 'react';
import Group from './Group';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableData } from 'react-draggable';
import { ISVGContext } from './SVGContext';
import Letter, { ILetter, LetterGroups } from './Letter';
import { partialCircle, Point } from './Utils';
import { v4 } from 'uuid';
import { ISVGCircleItem } from './SVG';
import { UpdateSVGItems } from '../../App';
import Draggable from '../../component/Draggable';

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
        const { r, text, id } = word;
        const letters = this.splitWordToLetters(text);
        const calculatedLetters = letters.map(
            (letter: string, index: number) => {
                const radians = -(Math.PI * 2) / letters.length;
                const initialPoint = this.initializeLetterPosition(letter, r);
                const rotatedPoint = initialPoint.rotate(radians * index);

                return {
                    ...rotatedPoint,
                    id: v4(),
                    r: 25,
                    text: letter,
                    angles: [],
                    isHovered: false,
                    isDragging: false,
                    children: []
                } as ILetter;
            }
        );

        updateSVGItems<IWord>([id], prevItem => ({
            ...prevItem,
            children: calculatedLetters
        }));

        calculateAngles();
    };

    private initializeLetterPosition = (
        letter: string,
        wordRadius: number
    ): Point => {
        switch (true) {
            case new RegExp(LetterGroups.DEEP_CUT, 'i').test(letter): {
                return new Point(0, wordRadius - 25 * 0.75);
            }

            case new RegExp(LetterGroups.INSIDE, 'i').test(letter): {
                return new Point(0, wordRadius - 25 - 5);
            }

            case new RegExp(LetterGroups.SHALLOW_CUT, 'i').test(letter):
            case new RegExp(LetterGroups.ON_LINE, 'i').test(letter):
            default: {
                return new Point(0, wordRadius);
            }
        }
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
