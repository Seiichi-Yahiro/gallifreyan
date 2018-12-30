import * as React from 'react';
import Group from './Group';
import { partialCircle } from './utils/Utils';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableData } from 'react-draggable';
import { ISVGCircleItem } from './SVG';
import Dot, { IDot } from './Dot';
import Draggable from '../../component/Draggable';
import { v4 } from 'uuid';
import {
    isDoubleDot,
    isFullCircle,
    isInside,
    isOnLine,
    isTripleDot
} from './utils/LetterGroups';
import Point from './utils/Point';
import withContext from '../../hocs/WithContext';
import AppContext, { IAppContext } from '../AppContext';

export interface ILetter extends ISVGCircleItem {
    text: string;
    angles: number[];
    children: IDot[];
}

interface IOwnProps {
    parent: string;
    letter: ILetter;
}

type ILetterProps = IOwnProps & IAppContext;

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
        const { letter, selection, parent } = this.props;
        const { x, y, r, id, text, isHovered, isDragging, children } = letter;
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
                    {isFullCircle(text) ? (
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
                        <Dot parent={[parent, id]} dot={dot} key={dot.id} />
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
        const moveAngle = (isInside(text) ? Math.PI : angleDifference) / 4;

        let defaultPosition: Point;
        if (isInside(text)) {
            const letterPos = new Point(letter.x, letter.y);
            const distance =
                letterPos.length() - (letterPos.length() - letter.r + 5);
            defaultPosition = letterPos
                .unit()
                .multiply(distance)
                .rotate(-Math.PI / 2);
        } else {
            defaultPosition = new Point(r - 5, 0).rotate(startAngle);
        }

        const defaultDot = {
            r: 2.5,
            isHovered: false,
            isDragging: false
        };

        let children: Point[] = [];

        if (isDoubleDot(text)) {
            children = [
                {
                    ...defaultPosition.rotate(3 * moveAngle)
                },
                {
                    ...defaultPosition.rotate(moveAngle)
                }
            ];
        } else if (isTripleDot(text)) {
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

        // Move dots outside for on line circles this is an aesthetic change
        if (isOnLine(text)) {
            children = children.map(point => point.rotate(Math.PI));
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

    private onDrag = (zoomX: number, zoomY: number) => (
        event: React.MouseEvent<HTMLElement>,
        data: DraggableData
    ) => {
        const { letter, parent } = this.props;
        const { x, y, id } = letter;
        const { deltaX, deltaY } = data;

        this.props.updateSVGItems<ILetter>([parent, id], prevItem => ({
            ...prevItem,
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
        this.props.calculateAngles(parent);
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

export default withContext(AppContext)(Letter);
