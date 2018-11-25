import * as React from 'react';
import Group from './Group';
import { partialCircle } from './Utils';
import { createClassName } from '../../component/ComponentUtils';
import { ISVGContext } from './SVGContext';
import { DraggableData } from 'react-draggable';
import { ISVGCircleItem } from './SVG';
import { UpdateSVGItems } from '../../App';
import { IDot } from './Dot';
import Draggable from '../../component/Draggable';

export enum LetterGroups {
    DEEP_CUT = 'b|ch|d|h|f',
    SHALLOW_CUT = 'j|k|l|n|p|m',
    INSIDE = 't|sh|r|v|w|s',
    ON_LINE = 'th|y|z|qu|x|ng',
    DOUBLE_LETTERS = 'ch|sh|th|qu|ng'
}

export interface ILetter extends ISVGCircleItem {
    text: string;
    angles: number[];
    children: IDot[];
}

interface ILetterProps {
    parent: string;
    letter: ILetter;
    selection: string[];
    select: (path: string[]) => void;
    updateSVGItems: UpdateSVGItems;
    calculateAngles: () => void;
}

class Letter extends React.Component<ILetterProps> {
    public render() {
        const {
            getPartialCircle,
            onClick,
            onDrag,
            toggleDragging,
            toggleHover
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
            <Draggable
                isSelected={isSelected}
                onDragStart={toggleDragging(true)}
                onDragStop={toggleDragging(false)}
                onDrag={onDrag}
            >
                <Group
                    x={x}
                    y={y}
                    className={groupClassNames}
                    onMouseEnter={toggleHover(true)}
                    onMouseLeave={toggleHover(false)}
                    onClick={onClick}
                >
                    {angles.length === 0 ? (
                        <circle r={r} />
                    ) : (
                        getPartialCircle()
                    )}
                </Group>
            </Draggable>
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

    private toggleDragging = (isDragging: boolean) => () =>
        this.props.updateSVGItems<ILetter>(
            [this.props.parent, this.props.letter.id],
            prevItem => ({
                ...prevItem,
                isDragging
            })
        );

    private onDrag = (svgContext: ISVGContext) => (
        event: MouseEvent,
        data: DraggableData
    ) => {
        const { letter, parent } = this.props;
        const { x, y, id } = letter;
        const { deltaX, deltaY } = data;
        const { zoomX, zoomY } = svgContext;

        this.props.updateSVGItems<ILetter>([parent, id], prevItem => ({
            ...prevItem,
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
        this.props.calculateAngles();
    };

    private toggleHover = (isHovered: boolean) => () =>
        this.props.updateSVGItems<ILetter>(
            [this.props.parent, this.props.letter.id],
            prevItem => ({
                ...prevItem,
                isHovered
            })
        );

    private onClick = () =>
        this.props.select([this.props.parent, this.props.letter.id]);
}

export default Letter;
