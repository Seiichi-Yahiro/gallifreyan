import * as React from 'react';
import Group from './Group';
import { partialCircle, Point } from './Utils';
import { createClassName } from '../../component/ComponentUtils';
import { ISVGContext } from './SVGContext';
import { DraggableData } from 'react-draggable';
import { ISVGCircleItem } from './SVG';
import { UpdateSVGItems } from '../../App';
import Dot, { IDot } from './Dot';
import Draggable from '../../component/Draggable';
import { v4 } from 'uuid';

export enum LetterGroups {
    DEEP_CUT = 'b|ch|d|h|f',
    SHALLOW_CUT = 'j|k|l|n|p|m',
    INSIDE = 't|sh|r|v|w|s',
    ON_LINE = 'th|y|z|qu|x|ng',
    DOUBLE_LETTERS = 'ch|sh|th|qu|ng',
    VOCAL = 'a|e|i|o|u',
    DOUBLE_DOT = 'ch|k|sh|y',
    TRIPLE_DOT = 'd|l|r|z',
    SINGLE_LINE = 'g|n|v|qu',
    DOUBLE_LINE = 'h|p|w|x',
    TRIPLE_LINE = 'f|m|s|ng'
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
    public componentDidMount() {
        this.initializeDots();
    }

    public componentDidUpdate(prevProps: ILetterProps) {
        if (prevProps.letter.text !== this.props.letter.text) {
            this.initializeDots();
        }
    }

    public render() {
        const {
            getPartialCircle,
            onClick,
            onDrag,
            toggleDragging,
            toggleHover
        } = this;
        const {
            letter,
            selection,
            select,
            updateSVGItems,
            parent
        } = this.props;
        const { x, y, r, id, angles, isHovered, isDragging, children } = letter;
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
                <Group x={x} y={y} className={groupClassNames}>
                    {angles.length === 0 ? (
                        <circle
                            r={r}
                            onMouseEnter={toggleHover(true)}
                            onMouseLeave={toggleHover(false)}
                            onClick={onClick}
                        />
                    ) : (
                        getPartialCircle()
                    )}

                    {children.map(dot => (
                        <Dot
                            parent={[parent, id]}
                            dot={dot}
                            updateSVGItems={updateSVGItems}
                            key={dot.id}
                            selection={selection}
                            select={select}
                        />
                    ))}
                </Group>
            </Draggable>
        );
    }

    private getPartialCircle = () => {
        const { angles, r } = this.props.letter;
        const [start, end] = angles;
        const { toggleHover, onClick } = this;

        return (
            <path
                onMouseEnter={toggleHover(true)}
                onMouseLeave={toggleHover(false)}
                onClick={onClick}
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

    private initializeDots = () => {
        const { letter, updateSVGItems, parent } = this.props;
        const { text, id, r, angles } = letter;
        const [startAngle, endAngle] = angles;
        const angleDifference =
            endAngle -
            (startAngle < endAngle ? startAngle + Math.PI * 2 : startAngle);
        const moveAngle = angleDifference / 4;
        const defaultPosition = new Point(r - 5, 0).rotate(startAngle);

        const defaultDot = {
            r: 2.5,
            isHovered: false,
            isDragging: false
        };

        let children: Point[] = [];

        if (new RegExp(LetterGroups.DOUBLE_DOT, 'i').test(text)) {
            children = [
                {
                    ...defaultPosition.rotate(3 * moveAngle)
                },
                {
                    ...defaultPosition.rotate(moveAngle)
                }
            ];
        } else if (new RegExp(LetterGroups.TRIPLE_DOT, 'i').test(text)) {
            children = [
                {
                    ...defaultPosition.rotate(3 * moveAngle)
                },
                {
                    ...defaultPosition.rotate(2 * moveAngle)
                },
                {
                    ...defaultPosition.rotate(moveAngle)
                }
            ];
        }

        updateSVGItems<ILetter>([parent, id], prevLetter => ({
            ...prevLetter,
            children: children.map(
                dot =>
                    ({
                        id: v4(),
                        ...defaultDot,
                        ...dot
                    } as IDot)
            )
        }));
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
