import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import Group from './Group';
import { createClassName } from '../../utils/ComponentUtils';
import Letter from './Letter';
import { partialCircle } from '../../utils/Utils';
import Draggable from '../../component/Draggable';
import * as _ from 'lodash';
import { IWord } from '../../types/SVG';
import { AppContextStateDispatch } from '../AppContext';
import { updateSVGItemsAction } from '../../store/AppStore';
import { initializeLetters } from '../../utils/LetterUtils';
import useDrag from '../../hooks/useDrag';
import useHover from '../../hooks/useHover';
import useSelect from '../../hooks/useSelect';

interface IWordProps {
    word: IWord;
}

const Word: React.FunctionComponent<IWordProps> = ({ word }) => {
    const { x, y, r, isHovered, isDragging, children: letters } = word;

    const dispatch = useContext(AppContextStateDispatch);
    const { toggleDragging, onDrag } = useDrag(word);
    const { toggleHover } = useHover(word);
    const { select, isSelected } = useSelect(word);

    useEffect(() => {
        dispatch(
            updateSVGItemsAction(word, () => ({
                children: initializeLetters(word)
            }))
        );
    }, [word.text]);

    const wordAngles = useMemo(() => {
        const angles = word.angles;
        if (angles.length >= 2) {
            angles.push(angles.shift()!);
            return _.chain(angles)
                .chunk(2)
                .map(([start, end]) => [start < end ? start + 2 * Math.PI : start, end])
                .value();
        }
        return [];
    }, [word.angles]);

    const groupClassNames = useMemo(
        () =>
            createClassName('svg-word', {
                'svg-word--is-selected': isSelected,
                'svg-word--is-hovered': isHovered,
                'svg-word--is-dragging': isDragging
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
                {wordAngles.length === 0 ? (
                    <circle r={r} />
                ) : (
                    wordAngles.map(([start, end], index: number) => (
                        <path d={partialCircle(0, 0, r, start, end)} key={index} />
                    ))
                )}

                <circle
                    r={r}
                    className="svg-word__selection-area"
                    onMouseEnter={toggleHover(true)}
                    onMouseLeave={toggleHover(false)}
                    onClick={select}
                />

                {letters.map(letter => (
                    <Letter letter={letter} key={letter.id} />
                ))}
            </Group>
        </Draggable>
    );
};

export default Word;
