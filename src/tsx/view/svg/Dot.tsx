import * as React from 'react';
import Group from './Group';
import Draggable from '../../component/Draggable';
import { DraggableData } from 'react-draggable';
import { createClassName } from '../../component/ComponentUtils';
import { IDot } from '../../types/SVG';
import AppContext from '../AppContext';

interface IDotProps {
    dot: IDot;
}

class Dot extends React.Component<IDotProps> {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    public render() {
        const { toggleDragging, toggleHover, onDrag, onClick } = this;
        const { dot } = this.props;
        const { selection } = this.context;
        const { x, y, r, isDragging, isHovered } = dot;
        const isSelected = selection === dot;

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
        this.context.updateSVGItems(this.props.dot, () => ({
            isDragging
        }));

    private onDrag = (zoomX: number, zoomY: number) => (event: React.MouseEvent<HTMLElement>, data: DraggableData) => {
        const { dot } = this.props;
        const { updateSVGItems } = this.context;
        const { x, y } = dot;
        const { deltaX, deltaY } = data;

        updateSVGItems(dot, () => ({
            x: x + deltaX / zoomX,
            y: y + deltaY / zoomY
        }));
    };

    private toggleHover = (isHovered: boolean) => () =>
        this.context.updateSVGItems(this.props.dot, () => ({
            isHovered
        }));

    private onClick = () => this.context.select(this.props.dot);
}

export default Dot;
