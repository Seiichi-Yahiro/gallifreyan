import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LetterId, WordId } from '@/redux/ids';
import wordThunks from '@/redux/thunks/wordThunks';
import type { Arc } from '@/redux/types/svgTypes';
import { antiArcsToArcs } from '@/redux/utils/intersections';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import SvgLetter from '@/svg/SvgLetter';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import React, { useCallback, useMemo, useState } from 'react';

interface SvgWordProps {
    id: WordId;
}

const SvgWord: React.FC<SvgWordProps> = ({ id }) => {
    const dispatch = useAppDispatch();

    const letters = useRedux((state) => state.text.elements[id].letters);

    const circle = useRedux((state) => state.svg.circles[id]);

    const [antiArcs, setAntiArcs] = useState<Record<LetterId, Arc>>({});

    // useCallback seems necessary for stryker to not get stuck in an infinite loop with the letter's useLayoutEffect
    const setAntiArc = useCallback(
        (letterId: LetterId, arc: Arc | undefined) => {
            setAntiArcs((prevState) => {
                const clone = { ...prevState };

                if (arc) {
                    clone[letterId] = arc;
                } else {
                    delete clone[letterId];
                }

                return clone;
            });
        },
        [],
    );

    const arcs = useMemo(() => {
        const sortedAntiArcs = Object.values(antiArcs).sort(
            (a, b) => a.end.value - b.end.value,
        );

        return antiArcsToArcs(sortedAntiArcs);
    }, [antiArcs]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const { onPointerDown } = useSvgDragAndDrop((pointerData) => {
        dispatch(wordThunks.drag(id, pointerData.movement));
    });

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            {arcs.length > 0 ? (
                <>
                    <SvgArc
                        radius={circle.radius}
                        arcs={arcs}
                        className="word"
                        isHovered={isHovered}
                        isSelected={isSelected}
                    />
                    <circle // hover does not work with arc directly because it is not a full circle
                        cx={0}
                        cy={0}
                        r={circle.radius}
                        fill="transparent"
                        stroke="transparent"
                        className="print:hidden"
                        onMouseEnter={onHover}
                        onMouseLeave={onHoverStop}
                        onClick={onSelect}
                        onPointerDown={isSelected ? onPointerDown : undefined}
                    />
                </>
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="word"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    onPointerDown={isSelected ? onPointerDown : undefined}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            )}
            {letters.map((letterId) => (
                <SvgLetter
                    key={letterId}
                    id={letterId}
                    setWordAntiArc={setAntiArc}
                />
            ))}
        </SvgGroup>
    );
};

export default SvgWord;
