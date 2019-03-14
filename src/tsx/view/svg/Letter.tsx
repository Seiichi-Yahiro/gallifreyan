import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import Group from './Group';
import { partialCircle } from '../../utils/Utils';
import { createClassName } from '../../utils/ComponentUtils';
import Dot from './Dot';
import Draggable from '../../component/Draggable';
import { isFullCircle } from '../../utils/LetterGroups';
import { ILetter } from '../../types/SVG';
import { AppContextStateDispatch } from '../AppContext';
import { updateSVGItemsAction } from '../../store/AppStore';
import { initializeDots } from '../../utils/DotUtils';
import useDrag from '../../hooks/useDrag';
import useHover from '../../hooks/useHover';
import useSelect from '../../hooks/useSelect';

interface ILetterProps {
    letter: ILetter;
}

const Letter: React.FunctionComponent<ILetterProps> = ({ letter }) => {
    const { x, y, r, text, children, angles } = letter;
    const [start, end] = angles;

    const dispatch = useContext(AppContextStateDispatch);
    const { toggleDragging, isDragging, onDrag } = useDrag(letter);
    const { toggleHover, isHovered } = useHover();
    const { select, isSelected } = useSelect(letter);

    useEffect(() => {
        dispatch(
            updateSVGItemsAction(letter, () => ({
                children: initializeDots(letter)
            }))
        );
    }, [letter.text]);

    const groupClassNames = useMemo(
        () =>
            createClassName('svg-letter', {
                'svg-letter--is-selected': isSelected,
                'svg-letter--is-hovered': isHovered,
                'svg-letter--is-dragging': isDragging
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
            <Group x={x} y={y} className={groupClassNames}>
                {isFullCircle(text) ? (
                    <circle r={r} onMouseEnter={toggleHover(true)} onMouseLeave={toggleHover(false)} onClick={select} />
                ) : (
                    <path
                        onMouseEnter={toggleHover(true)}
                        onMouseLeave={toggleHover(false)}
                        onClick={select}
                        d={partialCircle(0, 0, letter.r, start < end ? start + 2 * Math.PI : start, end)}
                    />
                )}

                {children.map(dot => (
                    <Dot dot={dot} key={dot.id} />
                ))}
            </Group>
        </Draggable>
    );
};

export default React.memo(Letter);
