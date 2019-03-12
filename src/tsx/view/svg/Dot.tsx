import * as React from 'react';
import { useMemo } from 'react';
import Group from './Group';
import Draggable from '../../component/Draggable';
import { createClassName } from '../../utils/ComponentUtils';
import { IDot } from '../../types/SVG';
import useDrag from '../../hooks/useDrag';
import useHover from '../../hooks/useHover';
import useSelect from '../../hooks/useSelect';

interface IDotProps {
    dot: IDot;
}

const Dot: React.FunctionComponent<IDotProps> = ({ dot }) => {
    const { x, y, r } = dot;

    const { toggleDragging, isDragging, onDrag } = useDrag(dot);
    const { toggleHover, isHovered } = useHover();
    const { select, isSelected } = useSelect(dot);

    const groupClassNames = useMemo(
        () =>
            createClassName('svg-dot', {
                'svg-dot--is-selected': isSelected,
                'svg-dot--is-hovered': isHovered,
                'svg-dot--is-dragging': isDragging
            }),
        [isSelected, isHovered, isDragging]
    );

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
                onClick={select}
            >
                <circle r={r} />
            </Group>
        </Draggable>
    );
};

export default Dot;
