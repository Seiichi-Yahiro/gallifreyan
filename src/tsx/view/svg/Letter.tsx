import * as React from 'react';
import Group from './Group';
import { partialCircle } from './Utils';
import { createClassName } from '../../component/ComponentUtils';
import { ISVGContext } from './SVGContext';
import { DraggableCore, DraggableData } from 'react-draggable';
import SVGContext from './SVGContext';
import ConditionalWrapper from '../../component/ConditionalWrapper';

export enum LetterGroups {
    DEEP_CUT = 'b|ch|d|h|f',
    SHALLOW_CUT = 'j|k|l|n|p|m',
    INSIDE = 't|sh|r|v|w|s',
    ON_LINE = 'th|y|z|qu|x|ng',
    DOUBLE_LETTERS = 'ch|sh|th|qu|ng'
}

export interface ILetter {
    readonly id: string;
    text: string;
    x: number;
    y: number;
    r: number;
    angles: number[];
    isHovered: boolean;
    isDragging: boolean;
}

interface ILetterProps {
    letter: ILetter;
    selection: string[];
    select: (letterId: string) => void;
    onDrag: (x: number, y: number) => void;
    updateLetter: (updateState: (prevLetter: ILetter) => ILetter) => void;
}

class Letter extends React.Component<ILetterProps> {
    public render() {
        const {
            getPartialCircle,
            onMouseEnter,
            onMouseLeave,
            onClick,
            draggableWrapper
        } = this;
        const { letter, selection } = this.props;
        const { x, y, r, id, angles, isHovered, isDragging } = letter;
        const isSelected = selection.length === 2 && id === selection[1];

        const groupClassNames = createClassName('svg-letter', {
            'svg-letter--is-selected': isSelected,
            'svg-letter--is-hovered': isHovered,
            'svg-letter--is-dragging': isDragging
        });

        return (
            <ConditionalWrapper
                condition={isSelected}
                wrapper={draggableWrapper}
            >
                <Group
                    x={x}
                    y={y}
                    className={groupClassNames}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onClick}
                >
                    {angles.length === 0 ? (
                        <circle r={r} />
                    ) : (
                        getPartialCircle()
                    )}
                </Group>
            </ConditionalWrapper>
        );
    }

    private getPartialCircle = () => {
        const { angles, r } = this.props.letter;
        const [start, end] = angles;
        return (
            <path
                d={partialCircle(
                    0,
                    0,
                    r,
                    start < end ? start + 2 * Math.PI : start,
                    end
                )}
            />
        );
    };

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

    private onDragStart = () =>
        this.props.updateLetter(prevLetter => ({
            ...prevLetter,
            isDragging: true
        }));
    private onDragEnd = () =>
        this.props.updateLetter(prevLetter => ({
            ...prevLetter,
            isDragging: false
        }));
    private onDrag = (svgContext: ISVGContext) => (
        event: MouseEvent,
        data: DraggableData
    ) => {
        const { x, y } = this.props.letter;
        const { deltaX, deltaY } = data;
        const { zoomX, zoomY } = svgContext;
        this.props.onDrag(x + deltaX / zoomX, y + deltaY / zoomY);
    };

    private onMouseEnter = (event: React.MouseEvent<SVGGElement>) =>
        this.props.updateLetter(prevLetter => ({
            ...prevLetter,
            isHovered: true
        }));

    private onMouseLeave = (event: React.MouseEvent<SVGGElement>) =>
        this.props.updateLetter(prevLetter => ({
            ...prevLetter,
            isHovered: false
        }));

    private onClick = () => this.props.select(this.props.letter.id);
}

export default Letter;
