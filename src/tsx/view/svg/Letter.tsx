import * as React from 'react';
import Group from './Group';
import { partialCircle } from './utils/Utils';
import { createClassName } from '../../component/ComponentUtils';
import { DraggableData } from 'react-draggable';
import Dot from './Dot';
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
import { IDot, ILetter } from '../../types/SVG';

interface IOwnProps {
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
        const { letter, selection } = this.props;
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
                        <Dot dot={dot} key={dot.id} />
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
        const { letter, updateSVGItems } = this.props;
        const { text, r, angles } = letter;
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
            children = [3 * moveAngle, moveAngle].map(angle =>
                defaultPosition.rotate(angle)
            );
        } else if (isTripleDot(text)) {
            children = [3 * moveAngle, 2 * moveAngle, moveAngle].map(angle =>
                defaultPosition.rotate(angle)
            );
        }

        // Move dots outside for on line circles this is an aesthetic change
        if (isOnLine(text)) {
            children = children.map(point => point.rotate(Math.PI));
        }

        updateSVGItems(letter, () => ({
            children: children.map(
                dot =>
                    ({
                        id: v4(),
                        parent: letter,
                        ...defaultDot,
                        ...dot
                    } as IDot)
            )
        }));
    };

    private toggleDragging = (isDragging: boolean) => () => {
        const { updateSVGItems, letter } = this.props;
        updateSVGItems(letter, () => ({
            isDragging
        }));
    };

    private onDrag = (zoomX: number, zoomY: number) => (
        event: React.MouseEvent<HTMLElement>,
        data: DraggableData
    ) => {
        const { letter, updateSVGItems, calculateAngles } = this.props;
        const { x, y, parent } = letter;
        const { deltaX, deltaY } = data;

        updateSVGItems(letter, () => ({
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
        calculateAngles(parent.id);
    };

    private toggleHover = (isHovered: boolean) => () => {
        const { updateSVGItems, letter } = this.props;

        updateSVGItems(letter, () => ({
            isHovered
        }));
    };

    private onClick = () => this.props.select(this.props.letter);
}

export default withContext(AppContext)(Letter);
