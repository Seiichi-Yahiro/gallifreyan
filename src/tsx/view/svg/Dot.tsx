import * as React from 'react';
import { ISVGCircleItem } from './SVG';
import Group from './Group';
import { UpdateSVGItems } from '../../App';
import Draggable from '../../component/Draggable';
import { ISVGContext } from './SVGContext';
import { DraggableData } from 'react-draggable';
import { createClassName } from '../../component/ComponentUtils';

export interface IDot extends ISVGCircleItem {}

interface IDotProps {
    parent: string[];
    dot: IDot;
    selection: string[];
    select: (path: string[]) => void;
    updateSVGItems: UpdateSVGItems;
}

class Dot extends React.Component<IDotProps> {
    public render() {
        const { toggleDragging, toggleHover, onDrag, onClick } = this;
        const { dot, selection } = this.props;
        const { id, x, y, r, isDragging, isHovered } = dot;
        const isSelected = selection.length === 3 && id === selection[2];

        const groupClassNames = createClassName('svg-dot', {
            'svg-dot--is-selected': isSelected,
            'svg-dot--is-hovered': isHovered,
            'svg-dot--is-dragging': isDragging
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
                    <circle r={r} />
                </Group>
            </Draggable>
        );
    }

    private toggleDragging = (isDragging: boolean) => () =>
        this.props.updateSVGItems<IDot>(
            [...this.props.parent, this.props.dot.id],
            prevItem => ({
                ...prevItem,
                isDragging
            })
        );

    private onDrag = (svgContext: ISVGContext) => (
        event: MouseEvent,
        data: DraggableData
    ) => {
        const { dot, parent } = this.props;
        const { x, y, id } = dot;
        const { deltaX, deltaY } = data;
        const { zoomX, zoomY } = svgContext;

        this.props.updateSVGItems<IDot>([...parent, id], prevItem => ({
            ...prevItem,
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
    };

    private toggleHover = (isHovered: boolean) => () =>
        this.props.updateSVGItems<IDot>(
            [...this.props.parent, this.props.dot.id],
            prevItem => ({
                ...prevItem,
                isHovered
            })
        );

    private onClick = () =>
        this.props.select([...this.props.parent, this.props.dot.id]);
}

export default Dot;
