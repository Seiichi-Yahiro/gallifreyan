import * as React from 'react';
import Group from './Group';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableCore, DraggableData } from 'react-draggable';
import ConditionalWrapper from '../../component/ConditionalWrapper';
import SVGContext, { ISVGContext } from './SVGContext';
import Letter, { ILetter, LetterGroups } from './Letter';
import { partialCircle, Point } from './Utils';
import { v4 } from 'uuid';
import { ISVGBaseItem, SVGItem } from './SVG';
import { IAppState } from '../../App';

export interface IWord extends ISVGBaseItem {
    children: ILetter[];
    angles: number[];
}

interface IWordProps {
    word: IWord;
    selection: string[];
    select: (path: string[]) => void;
    updateSVGItems: (
        path: string[],
        update: (prevItem: SVGItem, prevState: IAppState) => SVGItem
    ) => void;
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
            calculateWordAnglePairs
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
        const { word, calculateAngles, updateSVGItems } = this.props;
        const { r, text, id } = word;
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
                    isDragging: false,
                    children: []
                } as ILetter;
            }
        );

        updateSVGItems([id], prevItem => ({
            ...prevItem,
            children: calculatedLetters
        }));

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

    private onDragStart = () =>
        this.props.updateSVGItems([this.props.word.id], prevItem => ({
            ...prevItem,
            isDragging: true
        }));

    private onDragEnd = () =>
        this.props.updateSVGItems([this.props.word.id], prevItem => ({
            ...prevItem,
            isDragging: false
        }));

    private onDrag = (svgContext: ISVGContext) => (
        event: MouseEvent,
        data: DraggableData
    ) => {
        const { word, updateSVGItems } = this.props;
        const { x, y, id } = word;
        const { deltaX, deltaY } = data;
        const { zoomX, zoomY } = svgContext;

        updateSVGItems([id], prevItem => ({
            ...prevItem,
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
    };

    private onMouseEnter = () =>
        this.props.updateSVGItems([this.props.word.id], prevItem => ({
            ...prevItem,
            isHovered: true
        }));

    private onMouseLeave = () =>
        this.props.updateSVGItems([this.props.word.id], prevItem => ({
            ...prevItem,
            isHovered: false
        }));

    private onClick = () => this.props.select([this.props.word.id]);
}

export default Word;
